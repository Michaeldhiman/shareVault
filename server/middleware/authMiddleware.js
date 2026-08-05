import { verifyAccessToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * Protects endpoints by verifying the incoming Access Token in the Authorization header.
 * Exclusively checks Bearer token to comply with Access/Refresh token separation.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header for Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, access token missing');
    }

    // Verify access token signature and expiration
    const decoded = verifyAccessToken(token);

    // Fetch user details excluding sensitive authHash
    const user = await User.findById(decoded.id).select('-authHash');

    if (!user) {
      res.status(401);
      throw new Error('User account no longer exists');
    }

    // Attach authenticated user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(
      new Error(
        error.name === 'TokenExpiredError' || error.message === 'jwt expired'
          ? 'Token expired, please log in again'
          : 'Not authorized, invalid access token'
      )
    );
  }
};
