import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import ApiError from '../utils/ApiError.js';

/**
 * Verifies the JWT issued at wallet sign-in and attaches the claims to
 * req.user (id, walletAddress, role, clearanceLevel, sbu, isRegistered).
 */
export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Missing or malformed Authorization header'));
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = {
      id: payload.sub,
      walletAddress: payload.walletAddress,
      role: payload.role,
      clearanceLevel: payload.clearanceLevel,
      sbu: payload.sbu,
      isRegistered: payload.isRegistered,
    };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Session expired, please sign in again'));
    }
    return next(new ApiError(401, 'Invalid authentication token'));
  }
}

export default authenticate;
