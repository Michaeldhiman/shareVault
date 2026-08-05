import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { generateAccessToken } from '../utils/jwtUtils.js';
import * as tokenService from './tokenService.js';

/**
 * Service handling authentication & user account business logic.
 */

/**
 * Generates a deterministic, cryptographically stable fake salt for non-existent email addresses.
 * Uses HMAC-SHA256 with a server secret so identical emails always yield the same fake salt,
 * while preventing email enumeration / Salt Oracle attacks.
 * @param {string} email
 * @returns {string} 32-character hex salt string (16 bytes)
 */
export const getDeterministicFakeSalt = (email) => {
  const secret = process.env.SALT_SECRET || process.env.JWT_SECRET || 'securevault_fallback_salt_secret_key';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(email.toLowerCase().trim());
  return hmac.digest('hex').substring(0, 32);
};

/**
 * Retrieves cryptographic salt for a given email address.
 * Anti-Enumeration Defense: Returns a deterministic fake salt if email does not exist.
 * @param {string} email
 * @returns {Promise<{salt: string}>}
 */
export const getUserSaltByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('salt');

  if (!user) {
    // Return deterministic fake salt to prevent user email enumeration attacks
    return { salt: getDeterministicFakeSalt(normalizedEmail) };
  }
  return { salt: user.salt };
};

/**
 * Registers a new user account. Generates Access Token and persistent Refresh Token.
 * @param {object} userData - { name, email, authHash, salt }
 * @returns {Promise<{user: object, accessToken: string, refreshToken: string}>}
 */
export const registerUser = async ({ name, email, authHash, salt }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if email already registered
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 400;
    throw error;
  }

  // Hash the client-derived auth key using bcrypt before persisting to database
  const saltRounds = 10;
  const hashedAuthHash = await bcrypt.hash(authHash, saltRounds);

  const user = await User.create({
    name,
    email: normalizedEmail,
    authHash: hashedAuthHash,
    salt,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = await tokenService.createRefreshToken(user._id);

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
};

/**
 * Authenticates a user login request. Generates Access Token and persistent Refresh Token.
 * @param {object} credentials - { email, authHash }
 * @returns {Promise<{user: object, accessToken: string, refreshToken: string}>}
 */
export const loginUser = async ({ email, authHash }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Verify client authentication hash against bcrypt hash in database
  const isMatch = await bcrypt.compare(authHash, user.authHash);

  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = await tokenService.createRefreshToken(user._id);

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
};

/**
 * Verifies a user's master password authHash without issuing a new token.
 * Used during vault unlock to verify master password locally.
 * @param {string} userId
 * @param {string} authHash
 * @returns {Promise<{valid: boolean}>}
 */
export const verifyMasterPassword = async (userId, authHash) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User account not found');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(authHash, user.authHash);

  if (!isMatch) {
    const error = new Error('Incorrect Master Password');
    error.statusCode = 401;
    throw error;
  }

  return { valid: true };
};

/**
 * Fetches user profile by ID.
 * @param {string} userId
 * @returns {Promise<object>}
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-authHash');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user.toJSON();
};

/**
 * Updates user profile details.
 * @param {string} userId
 * @param {object} updateData - { name }
 * @returns {Promise<object>}
 */
export const updateUserProfile = async (userId, { name }) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (name) user.name = name;

  await user.save();
  return user.toJSON();
};
