import prisma from '../config/db.js';
import provider from '../config/blockchain.js';
import config from '../config/env.js';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';
import ipfsService from './ipfs.service.js';
import { computeIdentityHash, decryptDossier } from '../utils/dossier.util.js';
import chainService from './chain.service.js';

/**
 * Anti-Tamper Verification Service (Issue #47 flagship feature).
 *
 * Given an asset ID or employee ID, independently re-derives the expected
 * cryptographic state (CID from IPFS, hash from dossier, custodian from DB)
 * and cross-checks it against the live Ethereum Sepolia on-chain state.
 *
 * A mismatch means the PostgreSQL read-cache was tampered with directly,
 * bypassing the application layer.
 */
export const tamperService = {
  /**
   * Verify a single asset's integrity:
   * 1. Load asset from PostgreSQL.
   * 2. Query on-chain: getAssetDetails(tokenId) and getCustodian(tokenId).
   * 3. Compare CID and custodian address.
   */
  async verifyAssetIntegrity(assetId) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');

    const asset = await prisma.asset.findFirst({
      where: { OR: [{ id: assetId }, { tokenId: assetId }] },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            walletAddress: true,
            externalId: true,
          },
        },
      },
    });

    if (!asset) throw new ApiError(404, 'Asset not found');

    const report = {
      assetId: asset.id,
      tokenId: asset.tokenId,
      assetName: asset.name,
      checkedAt: new Date().toISOString(),
      onChainAvailable: false,
      verifications: [],
    };

    // --- On-Chain Check ---
    if (!asset.tokenId) {
      report.onChainAvailable = false;
      report.verifications.push({
        check: 'ON_CHAIN_TOKEN',
        status: 'SKIPPED',
        reason: 'Asset has no on-chain tokenId — minted off-chain only',
      });
      return report;
    }

    const onChain = await chainService.getAssetOnChain(asset.tokenId);

    if (!onChain.found) {
      report.onChainAvailable = false;
      report.verifications.push({
        check: 'ON_CHAIN_TOKEN',
        status: 'NOT_FOUND',
        reason: onChain.error || `Token #${asset.tokenId} not found on-chain`,
      });
      return report;
    }

    report.onChainAvailable = true;

    // --- Check 1: CID integrity (IPFS URI drift detection) ---
    const onChainCid = onChain.tokenURI.replace(/^ipfs:\/\//, '');
    const cidMatch = onChainCid === asset.cid;

    report.verifications.push({
      check: 'CID_INTEGRITY',
      status: cidMatch ? 'CID_MATCH' : 'CID_DRIFT',
      dbValue: asset.cid,
      onChainValue: onChainCid,
      description: cidMatch
        ? 'IPFS CID in PostgreSQL matches on-chain tokenURI'
        : 'ALERT: IPFS CID in PostgreSQL does NOT match on-chain tokenURI — potential DB tampering detected',
    });

    // --- Check 2: Current custodian wallet address ---
    const expectedCustodian = (asset.owner?.walletAddress || '').toLowerCase();
    const onChainCustodian = (onChain.custodian || '').toLowerCase();
    const custodianMatch = expectedCustodian && onChainCustodian &&
      expectedCustodian === onChainCustodian;

    report.verifications.push({
      check: 'CUSTODIAN_INTEGRITY',
      status: custodianMatch ? 'CUSTODIAN_MATCH' : 'CUSTODIAN_DRIFT',
      dbValue: asset.owner?.walletAddress || null,
      onChainValue: onChain.custodian,
      description: custodianMatch
        ? 'Current custodian wallet in PostgreSQL matches on-chain custodian'
        : 'ALERT: Custodian wallet in PostgreSQL does NOT match on-chain custodian — potential unauthorized custody change detected',
    });

    // --- Check 3: Classification tier ---
    const tierMatch = Number(onChain.classificationTier) === asset.classificationTier;
    report.verifications.push({
      check: 'CLASSIFICATION_INTEGRITY',
      status: tierMatch ? 'TIER_MATCH' : 'TIER_DRIFT',
      dbValue: asset.classificationTier,
      onChainValue: Number(onChain.classificationTier),
      description: tierMatch
        ? 'Classification tier in PostgreSQL matches on-chain value'
        : 'ALERT: Classification tier mismatch detected — DB may have been modified',
    });

    // Overall verdict
    const allPassed = report.verifications.every((v) =>
      ['CID_MATCH', 'CUSTODIAN_MATCH', 'TIER_MATCH'].includes(v.status)
    );
    report.verdict = allPassed ? 'INTEGRITY_OK' : 'INTEGRITY_COMPROMISED';

    return report;
  },

  /**
   * Verify an employee identity's integrity:
   * 1. Load user from PostgreSQL (identityHash, identitySalt, dossierCid).
   * 2. Fetch encrypted dossier from IPFS via Pinata gateway.
   * 3. Decrypt dossier and recompute keccak256(externalId, fullName, sbu, salt).
   * 4. Compare recomputed hash vs stored identityHash.
   */
  async verifyIdentityIntegrity(employeeId) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');

    // Accept either the internal UUID or externalId (BEL employee code)
    const user = await prisma.user.findFirst({
      where: { OR: [{ id: employeeId }, { externalId: employeeId }] },
      select: {
        id: true,
        externalId: true,
        displayName: true,
        walletAddress: true,
        identityHash: true,
        identitySalt: true,
        dossierCid: true,
        sbu: true,
      },
    });

    if (!user) throw new ApiError(404, 'Employee identity not found');

    const report = {
      employeeId: user.id,
      externalId: user.externalId,
      displayName: user.displayName,
      walletAddress: user.walletAddress,
      checkedAt: new Date().toISOString(),
      ipfsAvailable: false,
      verifications: [],
    };

    if (!user.dossierCid) {
      report.verifications.push({
        check: 'DOSSIER_CID',
        status: 'SKIPPED',
        reason: 'No dossierCid stored for this identity — registered before IPFS integration',
      });
      report.verdict = 'PARTIAL';
      return report;
    }

    // Fetch dossier from IPFS
    let dossier = null;
    try {
      const gateway = config.pinataGateway || 'https://gateway.pinata.cloud/ipfs';
      const url = `${gateway}/${user.dossierCid}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error(`IPFS gateway returned ${response.status}`);
      const raw = await response.json();
      dossier = decryptDossier(raw);
      report.ipfsAvailable = true;
    } catch (err) {
      report.verifications.push({
        check: 'IPFS_DOSSIER_FETCH',
        status: 'FETCH_ERROR',
        reason: `Failed to fetch or decrypt dossier from IPFS: ${err.message}`,
      });
      report.verdict = 'VERIFICATION_ERROR';
      return report;
    }

    // Recompute identity hash from decrypted dossier fields
    let recomputedHash = null;
    try {
      recomputedHash = computeIdentityHash({
        externalId: dossier.externalId,
        fullName:   dossier.fullName,
        sbu:        dossier.sbu,
        salt:       user.identitySalt,
      });
    } catch (err) {
      report.verifications.push({
        check: 'IDENTITY_HASH_RECOMPUTE',
        status: 'COMPUTE_ERROR',
        reason: `Failed to recompute identity hash: ${err.message}`,
      });
      report.verdict = 'VERIFICATION_ERROR';
      return report;
    }

    const hashMatch = recomputedHash === user.identityHash;

    report.verifications.push({
      check: 'IDENTITY_HASH_INTEGRITY',
      status: hashMatch ? 'HASH_MATCH' : 'HASH_DRIFT',
      storedHash: user.identityHash,
      recomputedHash,
      description: hashMatch
        ? 'Recomputed keccak256(externalId, fullName, sbu, salt) matches stored identityHash'
        : 'ALERT: Recomputed identity hash does NOT match stored hash — PII dossier or DB record may have been tampered with',
    });

    // SBU cross-check: dossier SBU vs DB SBU
    const sbuMatch = dossier.sbu === user.sbu;
    report.verifications.push({
      check: 'SBU_INTEGRITY',
      status: sbuMatch ? 'SBU_MATCH' : 'SBU_DRIFT',
      dbValue: user.sbu,
      dossierValue: dossier.sbu,
      description: sbuMatch
        ? 'SBU in PostgreSQL matches SBU encrypted in IPFS dossier'
        : 'ALERT: SBU in PostgreSQL does NOT match dossier — potential privilege escalation detected',
    });

    // Check 3: On-Chain IdentityRegistry verification
    const onChainIdentity = await chainService.verifyIdentityOnChain({
      walletAddress: user.walletAddress,
      identityHash: user.identityHash,
    });

    if (onChainIdentity.verified) {
      report.verifications.push({
        check: 'ON_CHAIN_IDENTITY_REGISTRY',
        status: 'ON_CHAIN_HASH_MATCH',
        onChainClearance: onChainIdentity.clearanceLevel,
        onChainSbu: onChainIdentity.sbuCode,
        description: 'Identity hash and clearance confirmed on Ethereum Sepolia IdentityRegistry',
      });
    } else if (onChainIdentity.error) {
      report.verifications.push({
        check: 'ON_CHAIN_IDENTITY_REGISTRY',
        status: 'SKIPPED',
        reason: onChainIdentity.error,
      });
    } else {
      report.verifications.push({
        check: 'ON_CHAIN_IDENTITY_REGISTRY',
        status: 'ON_CHAIN_HASH_DRIFT',
        description: 'ALERT: Identity hash in DB does NOT match on-chain IdentityRegistry hash',
      });
    }

    const allPassed = report.verifications.every((v) =>
      ['HASH_MATCH', 'SBU_MATCH', 'ON_CHAIN_HASH_MATCH', 'SKIPPED'].includes(v.status)
    );
    report.verdict = allPassed ? 'INTEGRITY_OK' : 'INTEGRITY_COMPROMISED';

    return report;
  },

  /**
   * Verify an arbitrary Ethereum Sepolia transaction by its tx hash.
   * Returns the transaction receipt and block data directly from the chain.
   */
  async verifyTransaction(txHash) {
    if (!provider) throw new ApiError(503, 'Blockchain provider not configured');

    try {
      const [tx, receipt] = await Promise.all([
        provider.getTransaction(txHash),
        provider.getTransactionReceipt(txHash),
      ]);

      if (!tx) throw new ApiError(404, `Transaction ${txHash} not found on Ethereum Sepolia`);

      const block = receipt ? await provider.getBlock(receipt.blockNumber) : null;

      return {
        txHash,
        network: 'Ethereum Sepolia (chainId: 11155111)',
        found: true,
        status: receipt
          ? (receipt.status === 1 ? 'SUCCESS' : 'REVERTED')
          : 'PENDING',
        from: tx.from,
        to: tx.to,
        blockNumber: receipt?.blockNumber?.toString() || null,
        blockHash: receipt?.blockHash || null,
        blockTimestamp: block?.timestamp
          ? new Date(block.timestamp * 1000).toISOString()
          : null,
        gasUsed: receipt?.gasUsed?.toString() || null,
        logsCount: receipt?.logs?.length ?? 0,
        explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`,
        checkedAt: new Date().toISOString(),
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(502, `Chain query failed: ${err.message}`);
    }
  },
};

export default tamperService;
