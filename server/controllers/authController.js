import * as authService from '../services/authService.js';

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
 * Register new user.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, authHash, salt } = req.body;
    const result = await authService.registerUser({ name, email, authHash, salt });

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
 * Authenticate user login.
 */
export const login = async (req, res, next) => {
  try {
    const { email, authHash } = req.body;
    const result = await authService.loginUser({ email, authHash });

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
 * POST /api/auth/logout
 * Client handles token removal; endpoint provides clean status response.
 */
export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
