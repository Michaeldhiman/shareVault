import axiosClient from './axiosClient';

/**
 * Authentication API Service methods
 */
export const authApi = {
  /**
   * Fetches salt for a user email.
   * @param {string} email
   */
  getSalt: (email) => axiosClient.get(`/auth/salt?email=${encodeURIComponent(email)}`),

  /**
   * Registers a new user.
   * @param {object} payload - { name, email, authHash, salt }
   */
  register: (payload) => axiosClient.post('/auth/register', payload),

  /**
   * Authenticates user login.
   * @param {object} payload - { email, authHash }
   */
  login: (payload) => axiosClient.post('/auth/login', payload),

  /**
   * Logs out user.
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
};
