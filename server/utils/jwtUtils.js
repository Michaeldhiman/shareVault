import jwt from 'jsonwebtoken';

/**
 * Utility functions for JSON Web Token (JWT) management.
 */

const JWT_SECRET = process.env.JWT_SECRET || 'securevault_fallback_secret_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;

/**
 * Generates a signed short-lived Access Token for API authorization.
 * @param {string} userId - MongoDB _id of the user
 * @returns {string} Signed JWT Access Token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  );
};

/**
 * Generates a signed long-lived Refresh Token.
 * @param {string} userId - MongoDB _id of the user
 * @returns {string} Signed JWT Refresh Token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
  );
};

/**
 * Verifies a JWT Access Token.
 * @param {string} token - JWT Access Token
 * @returns {object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Verifies a JWT Refresh Token.
 * @param {string} token - JWT Refresh Token
 * @returns {object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

/**
 * Sets an HttpOnly, secure Refresh Token cookie on the HTTP response.
 * @param {object} res - Express Response object
 * @param {string} token - Signed Refresh Token string
 */
export const sendRefreshTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true, // Prevents XSS scripts from reading the token
    secure: isProduction, // Enforces HTTPS in production
    sameSite: isProduction ? 'none' : 'lax', // Protects against CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    path: '/api/auth', // Scope the cookie specifically to auth endpoints for security
  };

  res.cookie('refreshToken', token, cookieOptions);
};

/**
 * Clears the HttpOnly Refresh Token cookie upon logout.
 * @param {object} res - Express Response object
 */
export const clearRefreshTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0),
    path: '/api/auth',
  });
};
