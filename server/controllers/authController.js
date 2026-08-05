import * as authService from '../services/authService.js';
import * as tokenService from '../services/tokenService.js';
import RefreshToken from '../models/RefreshToken.js';
import { sendRefreshTokenCookie, clearRefreshTokenCookie, generateAccessToken } from '../utils/jwtUtils.js';

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
 * Register new user. Sets HttpOnly Refresh Token cookie, returns Access Token.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, authHash, salt } = req.body;
    const result = await authService.registerUser({ name, email, authHash, salt });

    // Set HttpOnly cookie for refresh token
    sendRefreshTokenCookie(res, result.refreshToken);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user login. Sets HttpOnly Refresh Token cookie, returns Access Token.
 */
export const login = async (req, res, next) => {
  try {
    const { email, authHash } = req.body;
    const result = await authService.loginUser({ email, authHash });

    // Set HttpOnly cookie for refresh token
    sendRefreshTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 * Validates the refresh token and issues a new Access Token.
 */
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    // Validate refresh token in DB (checks signature, expiry, and revocation)
    const userId = await tokenService.verifyRefreshTokenInDb(refreshToken);

    // Generate a brand new access token
    const accessToken = generateAccessToken(userId);

    res.status(200).json({
      success: true,
      message: 'Session token renewed successfully',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    // Return standard 401 response for all token validation errors
    res.status(401);
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
 * Clears HttpOnly Refresh Token cookie and revokes token in DB.
 */
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // Revoke refresh token in database
    if (refreshToken) {
      await tokenService.revokeRefreshToken(refreshToken);
    }

    // Clear client cookie
    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/sessions
 * Retrieves all active refresh token sessions for the logged-in user.
 */
export const getActiveSessions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const currentToken = req.cookies.refreshToken;

    const sessions = await RefreshToken.find({ userId }).select('createdAt expiresAt token');

    const formattedSessions = sessions.map((s) => ({
      id: s._id,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: s.token === currentToken,
    }));

    res.status(200).json({
      success: true,
      message: 'Active sessions retrieved successfully',
      data: formattedSessions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/sessions/logout-all
 * Revokes all refresh token sessions for the logged-in user except the current one.
 */
export const logoutOtherSessions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const currentToken = req.cookies.refreshToken;

    // Delete all refresh tokens for this user EXCEPT the current one
    await RefreshToken.deleteMany({
      userId,
      token: { $ne: currentToken },
    });

    res.status(200).json({
      success: true,
      message: 'Logged out of all other sessions successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
