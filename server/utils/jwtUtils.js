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

/**
 * Sets an HttpOnly, secure authentication cookie on the HTTP response.
 * @param {object} res - Express Response object
 * @param {string} token - Signed JWT string
 */
export const sendTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true, // Prevents XSS scripts from reading the token
    secure: isProduction, // Enforces HTTPS in production
    sameSite: isProduction ? 'none' : 'lax', // Protects against CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  res.cookie('token', token, cookieOptions);
};

/**
 * Clears the HttpOnly authentication cookie upon logout.
 * @param {object} res - Express Response object
 */
export const clearTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0),
  });
};
