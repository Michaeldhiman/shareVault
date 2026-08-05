import RefreshToken from '../models/RefreshToken.js';
import User from '../models/User.js';
import { generateRefreshToken, verifyRefreshToken } from '../utils/jwtUtils.js';

/**
 * Token Service
 * Manages the lifecycle of refresh tokens (creation, verification, database persistence, and revocation).
 */

/**
 * Generates a signed Refresh Token, saves its metadata in the database, and returns it.
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<string>} Signed Refresh Token
 */
export const createRefreshToken = async (userId) => {
  const token = generateRefreshToken(userId);
  
  // Calculate expiration date (30 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Store in database
  await RefreshToken.create({
    token,
    userId,
    expiresAt,
  });

  return token;
};

/**
 * Verifies a Refresh Token JWT and validates its existence and active status in the database.
 * @param {string} token - Signed Refresh Token string
 * @returns {Promise<string>} User ID associated with the token
 */
export const verifyRefreshTokenInDb = async (token) => {
  if (!token) {
    const error = new Error('Refresh token is required');
    error.statusCode = 401;
    throw error;
  }

  // 1. Verify signature and expiry using JWT library
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    const error = new Error(
      err.name === 'TokenExpiredError' ? 'Refresh token expired' : 'Invalid refresh token'
    );
    error.statusCode = 401;
    throw error;
  }

  // 2. Validate existence and non-revoked status in the database
  const tokenDoc = await RefreshToken.findOne({ token });
  if (!tokenDoc) {
    const error = new Error('Session has expired or token has been revoked');
    error.statusCode = 401;
    throw error;
  }

  if (tokenDoc.isRevoked) {
    const error = new Error('This session has been revoked');
    error.statusCode = 401;
    throw error;
  }

  // Check if manually expired in database (as a backup to TTL index)
  if (tokenDoc.expiresAt < new Date()) {
    const error = new Error('Refresh token has expired');
    error.statusCode = 401;
    throw error;
  }

  // 3. Verify that the associated user still exists
  const userExists = await User.exists({ _id: tokenDoc.userId });
  if (!userExists) {
    const error = new Error('Associated user account no longer exists');
    error.statusCode = 401;
    throw error;
  }

  return tokenDoc.userId;
};

/**
 * Revokes a Refresh Token by marking it as revoked or deleting it from the database.
 * @param {string} token - Signed Refresh Token string
 * @returns {Promise<void>}
 */
export const revokeRefreshToken = async (token) => {
  if (!token) return;
  
  // Hard delete is highly secure as it completely removes the session trace
  await RefreshToken.deleteOne({ token });
};

/**
 * Revokes all refresh tokens belonging to a user (e.g., password change security event).
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<void>}
 */
export const revokeAllUserTokens = async (userId) => {
  await RefreshToken.deleteMany({ userId });
};
