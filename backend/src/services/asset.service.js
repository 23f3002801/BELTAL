import { ethers } from 'ethers';
import prisma from '../config/db.js';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';
import ipfsService from './ipfs.service.js';
import chainService from './chain.service.js';

export const assetService = {
  /**
   * Admin / Manager: Mint a new defence asset NFT and assign custody (Issue #45).
   * 1. Resolves target custodian (owner).
   * 2. Enforces custody clearance gate (user.clearanceLevel >= asset.classificationTier).
   * 3. Uploads structured metadata to IPFS via Pinata.
   * 4. Calls smart contract mint function (or logs graceful fallback).
   * 5. Persists Asset and AuditEvent in PostgreSQL.
   */
  async mintAsset(callerUser, input) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');

    // 1. Resolve Target Custodian
    let custodian = null;
    if (input.ownerId) {
      custodian = await prisma.user.findUnique({ where: { id: input.ownerId } });
    } else if (input.ownerWalletAddress) {
      const checksumAddress = ethers.getAddress(input.ownerWalletAddress);
      custodian = await prisma.user.findUnique({ where: { walletAddress: checksumAddress } });
    } else if (callerUser && callerUser.id) {
      custodian = await prisma.user.findUnique({ where: { id: callerUser.id } });
    }

    if (!custodian) {
      throw new ApiError(404, 'Target custodian identity not found');
    }

    // 2. Custody & Clearance Gates (user.clearanceLevel >= asset.classificationTier)
    if (custodian.clearanceLevel < input.classificationTier) {
      throw new ApiError(
        400,
        `Custodian clearance level (Level ${custodian.clearanceLevel}) is insufficient for this asset classification (requires Level ${input.classificationTier})`
      );
    }

    // Optional SBU alignment check for non-superadmins
    if (custodian.sbu && custodian.sbu !== input.sbu && callerUser?.role !== 'ADMIN') {
      throw new ApiError(
        400,
        `Custodian belongs to ${custodian.sbu}, which does not match asset SBU ${input.sbu}`
      );
    }

    // 3. Pin Asset Specifications & Metadata to IPFS
    const ipfsPayload = {
      name: input.name,
      classificationTier: input.classificationTier,
      sbu: input.sbu,
      initialCustodian: {
        id: custodian.id,
        walletAddress: custodian.walletAddress,
        externalId: custodian.externalId,
        displayName: custodian.displayName,
      },
      metadata: input.metadata || {},
      mintedAt: new Date().toISOString(),
      mintedBy: {
        id: callerUser?.id,
        walletAddress: callerUser?.walletAddress,
        role: callerUser?.role,
      },
    };

    const cid = await ipfsService.pinJson(ipfsPayload, {
      name: `asset-${input.name.replace(/\s+/g, '-').toLowerCase()}`,
    });

    // 4. On-chain Minting via Smart Contract (Soulbound Custody Token)
    const chainResult = await chainService.mintAssetOnChain({
      custodianWallet: custodian.walletAddress,
      assetTag: input.metadata?.assetTag || input.name,
      classificationTier: input.classificationTier,
      sbu: input.sbu,
      ipfsCid: cid,
    });

    if (!chainResult.confirmed) {
      logger.warn(
        `Asset "${input.name}" minted off-chain with IPFS CID ${cid} pending smart contract integration.`
      );
    }

    const resolvedTokenId = input.tokenId || (chainResult.tokenId ? String(chainResult.tokenId) : null);
    if (resolvedTokenId) {
      await prisma.asset.deleteMany({ where: { tokenId: resolvedTokenId } }).catch(() => { });
    }

    // 5. Persist Asset in PostgreSQL Cache
    const asset = await prisma.asset.create({
      data: {
        name: input.name,
        tokenId: resolvedTokenId,
        cid,
        classificationTier: input.classificationTier,
        sbu: input.sbu,
        metadata: input.metadata || {},
        mintTxHash: chainResult.txHash,
        ownerId: custodian.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            externalId: true,
            walletAddress: true,
            role: true,
            clearanceLevel: true,
            sbu: true,
          },
        },
      },
    });

    // 6. Log Immutable Audit Trail Event
    await prisma.auditEvent
      .create({
        data: {
          type: 'ASSET_MINTED',
          actorId: callerUser?.id || null,
          targetId: asset.id,
          txHash: chainResult.txHash || `0xoffchain_${Date.now().toString(16)}`,
          blockNumber: chainResult.blockNumber ? BigInt(chainResult.blockNumber) : BigInt(0),
          payload: {
            assetId: asset.id,
            name: asset.name,
            classificationTier: asset.classificationTier,
            sbu: asset.sbu,
            cid,
            custodianId: custodian.id,
            custodianWallet: custodian.walletAddress,
          },
        },
      })
      .catch((err) => logger.warn(`Failed to create audit log for asset mint: ${err.message}`));

    return { asset, chain: chainResult };
  },

  /**
   * List assets currently in the caller's custody
   */
  async getMyAssets(callerUser) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');
    if (!callerUser || !callerUser.id) {
      throw new ApiError(401, 'Authentication required to view custody assets');
    }

    const assets = await prisma.asset.findMany({
      where: { ownerId: callerUser.id },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            externalId: true,
            walletAddress: true,
            role: true,
            clearanceLevel: true,
            sbu: true,
          },
        },
      },
    });

    return assets;
  },

  /**
   * Fetch single asset details with soulbound custody history and audit events
   */
  async getAssetById(assetId) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');

    const asset = await prisma.asset.findFirst({
      where: {
        OR: [{ id: assetId }, { tokenId: assetId }],
      },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            externalId: true,
            walletAddress: true,
            role: true,
            clearanceLevel: true,
            sbu: true,
          },
        },
        transferRequests: {
          orderBy: { createdAt: 'desc' },
          include: {
            fromUser: { select: { id: true, displayName: true, walletAddress: true } },
            toUser: { select: { id: true, displayName: true, walletAddress: true } },
            requestedBy: { select: { id: true, displayName: true } },
            approvedBy: { select: { id: true, displayName: true } },
          },
        },
      },
    });

    if (!asset) {
      throw new ApiError(404, 'Asset not found');
    }

    // Retrieve related audit events for this asset
    const auditLogs = await prisma.auditEvent.findMany({
      where: { targetId: asset.id },
      orderBy: { createdAt: 'asc' },
      include: {
        actor: {
          select: {
            id: true,
            displayName: true,
            walletAddress: true,
            role: true,
          },
        },
      },
    });

    // Structure soulbound custody history
    const custodyHistory = [
      {
        event: 'MINTED_AND_ASSIGNED',
        custodian: asset.owner,
        timestamp: asset.createdAt,
        txHash: asset.mintTxHash,
        cid: asset.cid,
      },
      ...asset.transferRequests
        .filter((tr) => tr.status === 'EXECUTED')
        .map((tr) => ({
          event: 'CUSTODY_TRANSFERRED',
          from: tr.fromUser,
          to: tr.toUser,
          approvedBy: tr.approvedBy,
          timestamp: tr.updatedAt,
          txHash: tr.txHash,
        })),
    ];

    return {
      ...asset,
      custodyHistory,
      auditLogs: auditLogs.map((log) => ({
        id: log.id,
        type: log.type,
        actor: log.actor,
        txHash: log.txHash,
        blockNumber: log.blockNumber ? log.blockNumber.toString() : '0',
        payload: log.payload,
        createdAt: log.createdAt,
      })),
    };
  },

  /**
   * Admin / Manager / Auditor: List & search all assets with filters and pagination
   */
  async listAssets(query) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const where = {};

    if (query.sbu) {
      where.sbu = query.sbu;
    }

    if (query.classificationTier) {
      where.classificationTier = parseInt(query.classificationTier, 10);
    }

    if (query.ownerId) {
      where.ownerId = query.ownerId;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { tokenId: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, assets] = await Promise.all([
      prisma.asset.count({ where }),
      prisma.asset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              displayName: true,
              externalId: true,
              walletAddress: true,
              role: true,
              clearanceLevel: true,
              sbu: true,
            },
          },
        },
      }),
    ]);

    return {
      assets,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};

export default assetService;