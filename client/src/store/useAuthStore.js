import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { deriveClientKeys } from '../crypto/keyDerivation';

/**
 * Auth Zustand Store
 * Manages user authentication state via HttpOnly Cookies & in-memory Vault Encryption Key.
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  encryptionKey: null, // Stored strictly in memory, never persisted to disk or localStorage
  isAuthenticated: false,
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

      // 2. Call register API with authHash and salt (sets HttpOnly cookie on res)
      const response = await authApi.register({ name, email, authHash, salt });
      const { user } = response.data;

      set({
        user,
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
      // 1. Fetch user salt from backend (anti-enumeration returns deterministic fake salt if non-existent)
      const saltResponse = await authApi.getSalt(email);
      const { salt } = saltResponse.data;

      // 2. Derive authHash and AES encryptionKey locally
      const { authHash, encryptionKey } = await deriveClientKeys(masterPassword, salt);

      // 3. Authenticate with backend (sets HttpOnly cookie on res)
      const response = await authApi.login({ email, authHash });
      const { user } = response.data;

      set({
        user,
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
   * Unlocks vault encryption key using dedicated /api/auth/verify endpoint (no token re-issuance).
   */
  unlockVault: async (masterPassword) => {
    const { user } = get();
    if (!user || !user.salt) return { success: false, message: 'User salt unavailable' };

    set({ loading: true, error: null });
    try {
      const { authHash, encryptionKey } = await deriveClientKeys(masterPassword, user.salt);

      // Verify master password authHash against server under active HttpOnly session
      await authApi.verifyMasterPassword({ authHash });

      set({ encryptionKey, loading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'Incorrect Master Password';
      set({ error: errorMsg, loading: false });
      return { success: false, message: errorMsg };
    }
  },

  /**
   * Checks current auth session status via HttpOnly cookie.
   */
  checkAuth: async () => {
    try {
      const response = await authApi.getProfile();
      set({ user: response.data, isAuthenticated: true });
    } catch (err) {
      set({ isAuthenticated: false, user: null, encryptionKey: null });
    }
  },

  /**
   * Logs out user, clears HttpOnly cookie, and purges memory state.
   */
  logoutUser: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout API failures
    } finally {
      set({
        user: null,
        encryptionKey: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },
}));
