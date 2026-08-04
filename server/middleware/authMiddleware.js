import { verifyToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * Protects endpoints by verifying incoming JWT tokens via HttpOnly Cookies or Authorization header fallback.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check HttpOnly cookie first (XSS safe)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback to Authorization header if present
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, session token missing');
    }

    // Verify token payload
    const decoded = verifyToken(token);

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
        error.message === 'jwt expired'
          ? 'Token expired, please log in again'
          : 'Not authorized, invalid session token'
      )
    );
  }
};
