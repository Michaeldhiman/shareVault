import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/jwtUtils.js';

/**
 * Service handling authentication & user account business logic.
 */

/**
 * Retrieves cryptographic salt for a given email address.
 * @param {string} email
 * @returns {Promise<{salt: string}>}
 */
export const getUserSaltByEmail = async (email) => {
  const user = await User.findOne({ email }).select('salt');
  if (!user) {
    const error = new Error('User not found with this email');
    error.statusCode = 404;
    throw error;
  }
  return { salt: user.salt };
};

/**
 * Registers a new user account.
 * @param {object} userData - { name, email, authHash, salt }
 * @returns {Promise<{user: object, token: string}>}
 */
export const registerUser = async ({ name, email, authHash, salt }) => {
  // Check if email already registered
  const existingUser = await User.findOne({ email });
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
    email,
    authHash: hashedAuthHash,
    salt,
  });

  const token = generateToken(user._id);

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Authenticates a user login request.
 * @param {object} credentials - { email, authHash }
 * @returns {Promise<{user: object, token: string}>}
 */
export const loginUser = async ({ email, authHash }) => {
  const user = await User.findOne({ email });

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

  const token = generateToken(user._id);

  return {
    user: user.toJSON(),
    token,
  };
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
