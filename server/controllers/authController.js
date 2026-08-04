import * as authService from '../services/authService.js';
import { sendTokenCookie, clearTokenCookie } from '../utils/jwtUtils.js';

/**
 * Controller handling authentication endpoints.
 */

/**
 * GET /api/auth/salt?email=...
 * Fetch salt associated with an email.
 */
export const getSalt = async (req, res, next) => {
  try {
    const { email } = req.query;
    const result = await authService.getUserSaltByEmail(email);

    res.status(200).json({
      success: true,
      message: 'Salt retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/register
 * Register new user. Sets HttpOnly session cookie.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, authHash, salt } = req.body;
    const result = await authService.registerUser({ name, email, authHash, salt });

    // Set HttpOnly cookie for session token
    sendTokenCookie(res, result.token);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user login. Sets HttpOnly session cookie.
 */
export const login = async (req, res, next) => {
  try {
    const { email, authHash } = req.body;
    const result = await authService.loginUser({ email, authHash });

    // Set HttpOnly cookie for session token
    sendTokenCookie(res, result.token);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify
 * Validates master password authHash without issuing a new token or cookie.
 */
export const verifyMasterPassword = async (req, res, next) => {
  try {
    const { authHash } = req.body;
    const userId = req.user._id;

    await authService.verifyMasterPassword(userId, authHash);

    res.status(200).json({
      success: true,
      message: 'Master password verified successfully',
      data: { valid: true },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Clears HttpOnly session cookie.
 */
export const logout = async (req, res, next) => {
  try {
    clearTokenCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
