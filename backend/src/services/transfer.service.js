import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

const transferInclude = {
  asset: { select: { id: true, name: true, classificationTier: true, sbu: true } },
  fromUser: { select: { id: true, displayName: true, walletAddress: true } },
  toUser: { select: { id: true, displayName: true, walletAddress: true } },
  requestedBy: { select: { id: true, displayName: true } },
  approvedBy: { select: { id: true, displayName: true } },
};

function ensureDatabase() {
  if (!prisma) throw new ApiError(503, 'Database unavailable');
}

function isApprover(user) {
  return user.role === 'ADMIN' || user.role === 'MANAGER';
}

export const transferService = {
  async requestTransfer(caller, { assetId, toUserId }) {
    ensureDatabase();

    const [asset, recipient] = await Promise.all([
      prisma.asset.findUnique({ where: { id: assetId } }),
      prisma.user.findUnique({ where: { id: toUserId } }),
    ]);

    if (!asset) throw new ApiError(404, 'Asset not found');
    if (!recipient) throw new ApiError(404, 'Recipient identity not found');
    if (asset.ownerId !== caller.id && !isApprover(caller)) {
      throw new ApiError(403, 'Only the current asset custodian can request a transfer');
    }
    if (recipient.id === asset.ownerId) {
      throw new ApiError(400, 'Recipient already owns this asset');
    }
    if (recipient.clearanceLevel < asset.classificationTier) {
      throw new ApiError(400, 'Recipient clearance level is insufficient for this asset');
    }

    const transferRequest = await prisma.transferRequest.create({
      data: {
        assetId: asset.id,
        fromUserId: asset.ownerId,
        toUserId: recipient.id,
        requestedById: caller.id,
      },
      include: transferInclude,
    });

    await prisma.auditEvent.create({
      data: {
        type: 'TRANSFER_REQUESTED',
        actorId: caller.id,
        targetId: asset.id,
        txHash: `0xoffchain_${Date.now().toString(16)}`,
        blockNumber: BigInt(0),
        payload: { transferRequestId: transferRequest.id, fromUserId: asset.ownerId, toUserId: recipient.id },
      },
    });

    return transferRequest;
  },

  async listTransfers(caller, { status, page = 1, limit = 20 }) {
    ensureDatabase();
    const where = isApprover(caller)
      ? { ...(status ? { status } : {}) }
      : {
          ...(status ? { status } : {}),
          OR: [{ fromUserId: caller.id }, { toUserId: caller.id }, { requestedById: caller.id }],
        };
    const skip = (page - 1) * limit;
    const [total, transferRequests] = await Promise.all([
      prisma.transferRequest.count({ where }),
      prisma.transferRequest.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: transferInclude }),
    ]);
    return { transferRequests, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  },

  async approveTransfer(caller, transferId) {
    ensureDatabase();
    const request = await prisma.transferRequest.findUnique({ where: { id: transferId }, include: { asset: true } });
    if (!request) throw new ApiError(404, 'Transfer request not found');
    if (request.status !== 'PENDING') throw new ApiError(400, 'Transfer request is no longer pending');

    const txHash = `0xoffchain_${Date.now().toString(16)}`;
    const transferRequest = await prisma.$transaction(async (tx) => {
      await tx.asset.update({ where: { id: request.assetId }, data: { ownerId: request.toUserId } });
      return tx.transferRequest.update({
        where: { id: transferId },
        data: { status: 'EXECUTED', approvedById: caller.id, txHash },
        include: transferInclude,
      });
    });
    return { transferRequest, chain: { txHash, blockNumber: null, confirmed: false } };
  },

  async rejectTransfer(caller, transferId) {
    ensureDatabase();
    const request = await prisma.transferRequest.findUnique({ where: { id: transferId } });
    if (!request) throw new ApiError(404, 'Transfer request not found');
    if (request.status !== 'PENDING') throw new ApiError(400, 'Transfer request is no longer pending');
    if (!isApprover(caller) && request.fromUserId !== caller.id && request.requestedById !== caller.id) {
      throw new ApiError(403, 'You cannot reject this transfer request');
    }
    return prisma.transferRequest.update({
      where: { id: transferId },
      data: { status: 'REJECTED', approvedById: isApprover(caller) ? caller.id : null },
      include: transferInclude,
    });
  },
};

export default transferService;
