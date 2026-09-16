import { ethers } from 'ethers';
import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

export const passService = {
  /**
   * Manager / Admin: Grant a time-boxed Cross-SBU access pass (Issue #46)
   */
  async grantCrossSbuPass(issuerUser, input) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');

    let targetUser = null;
    if (input.userId) {
      targetUser = await prisma.user.findUnique({ where: { id: input.userId } });
    } else if (input.walletAddress) {
      const checksumAddress = ethers.getAddress(input.walletAddress);
      targetUser = await prisma.user.findUnique({ where: { walletAddress: checksumAddress } });
    }

    if (!targetUser) {
      throw new ApiError(404, 'Target personnel identity not found');
    }

    let validUntil;
    if (input.validUntil) {
      validUntil = new Date(input.validUntil);
    } else {
      const hours = input.durationHours || 24;
      validUntil = new Date(Date.now() + hours * 3600 * 1000);
    }

    const pass = await prisma.crossSbuPass.create({
      data: {
        userId: targetUser.id,
        targetSbu: input.targetSbu,
        validUntil,
        reason: input.reason || 'Cross-department technical assignment',
        issuedById: issuerUser?.id || targetUser.id,
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            externalId: true,
            walletAddress: true,
            sbu: true,
          },
        },
        issuedBy: {
          select: {
            id: true,
            displayName: true,
            role: true,
          },
        },
      },
    });

    return pass;
  },

  /**
   * Check if user possesses an active, unexpired Cross-SBU pass for a given SBU
   */
  async hasActiveCrossSbuPass(userId, targetSbu) {
    if (!prisma) return false;

    const activePass = await prisma.crossSbuPass.findFirst({
      where: {
        userId,
        targetSbu,
        validUntil: { gt: new Date() },
      },
    });

    return Boolean(activePass);
  },

  /**
   * Retrieve active passes for a user
   */
  async getActivePassesForUser(userId) {
    if (!prisma) throw new ApiError(503, 'Database unavailable');

    return prisma.crossSbuPass.findMany({
      where: {
        userId,
        validUntil: { gt: new Date() },
      },
      include: {
        issuedBy: {
          select: { id: true, displayName: true, role: true },
        },
      },
      orderBy: { validUntil: 'desc' },
    });
  },
};

export default passService;
