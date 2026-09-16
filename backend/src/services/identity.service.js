import { ethers } from 'ethers';
import crypto from 'crypto';
import prisma from '../config/db.js';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';
import chainService from './chain.service.js';
import ipfsService from './ipfs.service.js';
import { computeIdentityHash, encryptDossier } from '../utils/dossier.util.js';

export const identityService = {
  /**
   * Admin: register a new identity (issue #44).
   * Order matters: dossier is pinned to IPFS and the chain call is attempted
   * before the Postgres row is written, so a mid-flight failure never leaves
   * a DB row pointing at a dossier/tx that doesn't actually exist.
   */
  async registerIdentity(input) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');

    let checksumAddress;
    try {
      checksumAddress = ethers.getAddress(input.walletAddress);
    } catch {
      throw new ApiError(400, 'Invalid Ethereum wallet address');
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ walletAddress: checksumAddress }, { externalId: input.externalId }] },
    });
    if (existing) {
      throw new ApiError(409, 'An identity already exists for this wallet address or employee code');
    }

    const identitySalt = crypto.randomBytes(16).toString('hex');
    const identityHash = computeIdentityHash({
      externalId: input.externalId,
      fullName: input.fullName,
      sbu: input.sbu,
      salt: identitySalt,
    });

    // Zero PII on-chain: only DID/wallet/hash go to the contract. Full PII
    // (fullName, employee code, plus any extra dossier fields) is encrypted
    // and pinned to IPFS; Postgres keeps only the display-relevant subset
    // (displayName/externalId) in plaintext for dashboards. See issues.txt #89.
    const dossier = {
      externalId: input.externalId,
      fullName: input.fullName,
      sbu: input.sbu,
      clearanceLevel: input.clearanceLevel,
      ...input.piiDossier,
      registeredAt: new Date().toISOString(),
    };
    const dossierCid = await ipfsService.pinJson(encryptDossier(dossier), {
      name: `identity-dossier-${input.externalId}`,
    });

    const chainResult = await chainService.registerIdentityOnChain({
      walletAddress: checksumAddress,
      did: `did:beltal:${input.externalId || checksumAddress.slice(2, 10)}`,
      identityHash,
      clearanceLevel: input.clearanceLevel,
      sbu: input.sbu,
    });
    if (!chainResult.confirmed) {
      logger.warn(`Identity for ${checksumAddress} will be created off-chain only pending contract integration.`);
    }

    const user = await prisma.user.create({
      data: {
        walletAddress: checksumAddress,
        externalId: input.externalId,
        displayName: input.displayName ?? input.fullName,
        role: input.role ?? 'USER',
        clearanceLevel: input.clearanceLevel,
        sbu: input.sbu,
        identityHash,
        identitySalt,
        dossierCid,
      },
    });

    return { user, chain: chainResult };
  },

  /**
   * Admin: assign/update role and/or clearance for an existing identity (issue #44).
   */
  async updateRole(userId, { role, clearanceLevel }) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, 'Identity not found');

    const chainResult = await chainService.assignRoleOnChain({
      walletAddress: user.walletAddress,
      role: role ?? user.role,
      clearanceLevel: clearanceLevel ?? user.clearanceLevel,
    });
    if (!chainResult.confirmed) {
      logger.warn(`Role/clearance update for ${user.walletAddress} applied off-chain only pending contract integration.`);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role !== undefined ? { role } : {}),
        ...(clearanceLevel !== undefined ? { clearanceLevel } : {}),
      },
    });

    return { user: updated, chain: chainResult };
  },
};

export default identityService;
