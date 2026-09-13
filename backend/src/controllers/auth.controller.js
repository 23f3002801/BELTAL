import authService from '../services/auth.service.js';

export const authController = {
  /**
   * Request challenge nonce for wallet sign-in
   * POST /api/auth/nonce
   */
  getNonce(req, res, next) {
    try {
      const { walletAddress } = req.body;
      const result = authService.requestNonce(walletAddress);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Verify ECDSA signature and log in / issue JWT
   * POST /api/auth/verify (and POST /api/auth/login)
   */
  async verify(req, res, next) {
    try {
      const { walletAddress, signature } = req.body;
      const result = await authService.verifyWalletLogin({ walletAddress, signature });
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
