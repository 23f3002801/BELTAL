import passService from '../services/pass.service.js';

export const passController = {
  /**
   * POST /api/passes/cross-sbu — Grant time-boxed Cross-SBU pass (Admin/Manager)
   */
  async grantCrossSbuPass(req, res, next) {
    try {
      const pass = await passService.grantCrossSbuPass(req.user, req.body);
      return res.status(201).json({
        success: true,
        data: pass,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/passes/cross-sbu/active/:userId — Get active passes for user
   */
  async getActivePasses(req, res, next) {
    try {
      const targetUserId = req.params.userId || req.user.id;
      const passes = await passService.getActivePassesForUser(targetUserId);
      return res.status(200).json({
        success: true,
        data: passes,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default passController;
