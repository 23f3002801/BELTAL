import identityService from '../services/identity.service.js';

export const adminController = {
  /**
   * POST /api/admin/identities
   */
  async registerIdentity(req, res, next) {
    try {
      const { user, chain } = await identityService.registerIdentity(req.body);
      return res.status(201).json({
        success: true,
        data: {
          id: user.id,
          walletAddress: user.walletAddress,
          externalId: user.externalId,
          displayName: user.displayName,
          role: user.role,
          clearanceLevel: user.clearanceLevel,
          sbu: user.sbu,
          identityHash: user.identityHash,
          dossierCid: user.dossierCid,
          createdAt: user.createdAt,
          chain,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/admin/identities/:id/role
   */
  async updateRole(req, res, next) {
    try {
      const { user, chain } = await identityService.updateRole(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          role: user.role,
          clearanceLevel: user.clearanceLevel,
          chain,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default adminController;
