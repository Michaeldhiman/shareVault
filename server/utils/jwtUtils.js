import jwt from 'jsonwebtoken';

/**
 * Utility functions for JSON Web Token (JWT) management.
 */

/**
 * Generates a signed JWT for an authenticated user.
 * @param {string} userId - MongoDB _id of the user
 * @returns {string} Signed JWT string
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'securevault_fallback_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verifies a JWT token.
 * @param {string} token - JWT token string
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'securevault_fallback_secret_key');
};
