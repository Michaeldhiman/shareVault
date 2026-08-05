import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { deriveClientKeys } from '../crypto/keyDerivation';
import { clearHibpCache } from '../utils/hibpService';

/**
 * Auth Zustand Store
 * Manages user authentication state via in-memory Access Tokens & Encryption Keys,
 * and tracks Refresh Token status silently.
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null, // In-memory JWT access token (short-lived, never persisted)
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

      // 2. Call register API with authHash and salt (sets HttpOnly cookie, returns accessToken)
      const response = await authApi.register({ name, email, authHash, salt });
      const { user, accessToken } = response.data;

      set({
        user,
        accessToken,
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

      // 3. Authenticate with backend (sets HttpOnly cookie, returns accessToken)
      const response = await authApi.login({ email, authHash });
      const { user, accessToken } = response.data;

      set({
        user,
        accessToken,
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

      // Verify master password authHash against server under active session
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
   * Checks current auth session status via refresh token flow (silent reload/wake login).
   */
  checkAuth: async () => {
    try {
      // 1. Attempt to renew the access token using the refresh cookie
      const refreshResponse = await authApi.refresh();
      const { accessToken } = refreshResponse.data;

      set({ accessToken });

      // 2. Load the profile using the new access token
      const profileResponse = await authApi.getProfile();
      set({ user: profileResponse.data, isAuthenticated: true });
    } catch (err) {
      // Wipe state if refresh token is absent or invalid
      clearHibpCache();
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        encryptionKey: null,
      });
    }
  },

  /**
   * Logs out user, revokes refresh session in DB, and purges all memory state.
   */
  logoutUser: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore logout API failures
    } finally {
      clearHibpCache();
      set({
        user: null,
        accessToken: null,
        encryptionKey: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },
}));
