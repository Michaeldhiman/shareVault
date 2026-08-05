import axiosClient from './axiosClient';

/**
 * Authentication API Service methods
 */
export const authApi = {
  /**
   * Fetches salt for a user email. Anti-enumeration returns deterministic fake salt if not found.
   * @param {string} email
   */
  getSalt: (email) => axiosClient.get(`/auth/salt?email=${encodeURIComponent(email)}`),

  /**
   * Registers a new user. Sets HttpOnly session cookie on backend.
   * @param {object} payload - { name, email, authHash, salt }
   */
  register: (payload) => axiosClient.post('/auth/register', payload),

  /**
   * Authenticates user login. Sets HttpOnly session cookie on backend.
   * @param {object} payload - { email, authHash }
   */
  login: (payload) => axiosClient.post('/auth/login', payload),

  /**
   * Renew authentication session via HttpOnly Refresh Token cookie.
   */
  refresh: () => axiosClient.post('/auth/refresh'),

  /**
   * Verifies master password authHash without issuing a new token or resetting session cookie.
   * @param {object} payload - { authHash }
   */
  verifyMasterPassword: (payload) => axiosClient.post('/auth/verify', payload),

  /**
   * Logs out user and clears HttpOnly session cookie.
   */
  logout: () => axiosClient.post('/auth/logout'),

  /**
   * Gets authenticated user profile.
   */
  getProfile: () => axiosClient.get('/user/profile'),

  /**
   * Updates user profile.
   * @param {object} payload - { name }
   */
  updateProfile: (payload) => axiosClient.put('/user/profile', payload),

  /**
   * Retrieves active refresh token sessions.
   */
  getSessions: () => axiosClient.get('/auth/sessions'),

  /**
   * Revokes all refresh token sessions except the current one.
   */
  logoutOtherSessions: () => axiosClient.post('/auth/sessions/logout-all'),
};
