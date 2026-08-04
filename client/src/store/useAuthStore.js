import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { deriveClientKeys } from '../crypto/keyDerivation';

/**
 * Auth Zustand Store
 * Manages user authentication state and in-memory Vault Encryption Key.
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('securevault_token') || null,
  encryptionKey: null, // Stored strictly in memory, never persisted
  isAuthenticated: !!localStorage.getItem('securevault_token'),
  loading: false,
  error: null,

  /**
   * Registers a new user with client-side key derivation.
   */
  registerUser: async ({ name, email, masterPassword }) => {
    set({ loading: true, error: null });
    try {
      // 1. Client-side key derivation via PBKDF2 (100,000 iterations)
      const { authHash, encryptionKey, salt } = await deriveClientKeys(masterPassword);

      // 2. Call register API with authHash and salt only
      const response = await authApi.register({ name, email, authHash, salt });
      const { user, token } = response.data;

      // 3. Save JWT token in localStorage and encryptionKey in memory
      localStorage.setItem('securevault_token', token);

      set({
        user,
        token,
        encryptionKey,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (err) {
      set({ error: err.message || 'Registration failed', loading: false });
      return { success: false, message: err.message };
    }
  },

  /**
   * Logs in an existing user with automated salt lookup and key derivation.
   */
  loginUser: async ({ email, masterPassword }) => {
    set({ loading: true, error: null });
    try {
      // 1. Fetch user salt from backend
      const saltResponse = await authApi.getSalt(email);
      const { salt } = saltResponse.data;

      // 2. Derive authHash and AES encryptionKey locally
      const { authHash, encryptionKey } = await deriveClientKeys(masterPassword, salt);

      // 3. Authenticate with backend
      const response = await authApi.login({ email, authHash });
      const { user, token } = response.data;

      // 4. Save token to localStorage and encryptionKey to memory
      localStorage.setItem('securevault_token', token);

      set({
        user,
        token,
        encryptionKey,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (err) {
      set({ error: err.message || 'Login failed', loading: false });
      return { success: false, message: err.message };
    }
  },

  /**
   * Unlocks vault encryption key if user is authenticated but key is missing from memory.
   */
  unlockVault: async (masterPassword) => {
    const { user } = get();
    if (!user || !user.salt) return { success: false, message: 'User salt unavailable' };

    set({ loading: true, error: null });
    try {
      const { authHash, encryptionKey } = await deriveClientKeys(masterPassword, user.salt);

      // Verify master password against server using authHash before trusting encryptionKey
      const response = await authApi.login({ email: user.email, authHash });
      if (response?.data?.token) {
        localStorage.setItem('securevault_token', response.data.token);
        set({ token: response.data.token, user: response.data.user || user });
      }

      set({ encryptionKey, loading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'Incorrect Master Password';
      set({ error: errorMsg, loading: false });
      return { success: false, message: errorMsg };
    }
  },

  /**
   * Checks current auth token validity and reloads user profile.
   */
  checkAuth: async () => {
    const token = localStorage.getItem('securevault_token');
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null, encryptionKey: null });
      return;
    }

    try {
      const response = await authApi.getProfile();
      set({ user: response.data, isAuthenticated: true });
    } catch (err) {
      localStorage.removeItem('securevault_token');
      set({ isAuthenticated: false, user: null, token: null, encryptionKey: null });
    }
  },

  /**
   * Logs out user and clears memory state.
   */
  logoutUser: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout API failures
    } finally {
      localStorage.removeItem('securevault_token');
      set({
        user: null,
        token: null,
        encryptionKey: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },
}));
