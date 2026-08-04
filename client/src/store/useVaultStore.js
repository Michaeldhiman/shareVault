import { create } from 'zustand';
import { vaultApi } from '../api/vaultApi';
import { encryptText, decryptText, generateIV, bufferToBase64 } from '../crypto/aes';

/**
 * Vault Zustand Store
 * Handles encrypted API requests and transparent client-side field decryption/encryption.
 */
export const useVaultStore = create((set, get) => ({
  items: [],
  searchQuery: '',
  selectedCategory: 'All',
  loading: false,
  error: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  /**
   * Fetches encrypted vault items from API and decrypts fields locally using in-memory encryptionKey.
   */
  fetchVault: async (encryptionKey) => {
    if (!encryptionKey) {
      set({ error: 'Encryption key unavailable in memory', loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await vaultApi.getVault();
      const rawItems = response.data || [];

      // Decrypt items locally in browser
      const decryptedItems = await Promise.all(
        rawItems.map(async (item) => {
          try {
            const username = await decryptText(item.encryptedUsername, item.iv, encryptionKey);
            const password = await decryptText(item.encryptedPassword, item.iv, encryptionKey);
            const notes = item.encryptedNotes
              ? await decryptText(item.encryptedNotes, item.iv, encryptionKey)
              : '';

            return {
              id: item._id,
              website: item.website,
              username,
              password,
              notes,
              category: item.category || 'Work',
              favorite: !!item.favorite,
              iv: item.iv,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            };
          } catch (decErr) {
            console.warn(`Could not decrypt vault item ${item._id}:`, decErr.message || decErr);
            return {
              id: item._id,
              website: item.website,
              username: '[Decryption Error]',
              password: '[Decryption Error]',
              notes: '',
              category: item.category || 'Work',
              favorite: !!item.favorite,
              iv: item.iv,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            };
          }
        })
      );

      set({ items: decryptedItems, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load vault items', loading: false });
    }
  },

  /**
   * Encrypts fields and creates a new vault credential using a shared 12-byte record IV.
   */
  addVaultItem: async (formData, encryptionKey) => {
    if (!encryptionKey) return { success: false, message: 'Vault is locked' };

    set({ loading: true, error: null });
    try {
      // 1. Generate one cryptographically secure 12-byte IV shared across all fields in this record
      const recordIvBytes = generateIV();
      const recordIvBase64 = bufferToBase64(recordIvBytes);

      // 2. Encrypt fields using the shared record IV
      const usernameEnc = await encryptText(formData.username, encryptionKey, recordIvBytes);
      const passwordEnc = await encryptText(formData.password, encryptionKey, recordIvBytes);
      const notesEnc = formData.notes
        ? await encryptText(formData.notes, encryptionKey, recordIvBytes)
        : { ciphertext: '' };

      const payload = {
        website: formData.website,
        encryptedUsername: usernameEnc.ciphertext,
        encryptedPassword: passwordEnc.ciphertext,
        encryptedNotes: notesEnc.ciphertext,
        iv: recordIvBase64,
        category: formData.category || 'Work',
        favorite: !!formData.favorite,
      };

      const response = await vaultApi.createVaultItem(payload);
      const newItem = response.data;

      const decryptedNewItem = {
        id: newItem._id,
        website: newItem.website,
        username: formData.username,
        password: formData.password,
        notes: formData.notes || '',
        category: newItem.category,
        favorite: newItem.favorite,
        iv: newItem.iv,
        createdAt: newItem.createdAt,
        updatedAt: newItem.updatedAt,
      };

      set((state) => ({
        items: [decryptedNewItem, ...state.items],
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message || 'Failed to add vault item', loading: false });
      return { success: false, message: err.message };
    }
  },

  /**
   * Encrypts fields and updates an existing credential using a shared 12-byte record IV.
   */
  updateVaultItem: async (id, formData, encryptionKey) => {
    if (!encryptionKey) return { success: false, message: 'Vault is locked' };

    set({ loading: true, error: null });
    try {
      const recordIvBytes = generateIV();
      const recordIvBase64 = bufferToBase64(recordIvBytes);

      const usernameEnc = await encryptText(formData.username, encryptionKey, recordIvBytes);
      const passwordEnc = await encryptText(formData.password, encryptionKey, recordIvBytes);
      const notesEnc = formData.notes
        ? await encryptText(formData.notes, encryptionKey, recordIvBytes)
        : { ciphertext: '' };

      const payload = {
        website: formData.website,
        encryptedUsername: usernameEnc.ciphertext,
        encryptedPassword: passwordEnc.ciphertext,
        encryptedNotes: notesEnc.ciphertext,
        iv: recordIvBase64,
        category: formData.category,
        favorite: formData.favorite,
      };

      const response = await vaultApi.updateVaultItem(id, payload);
      const updatedItem = response.data;

      const decryptedUpdatedItem = {
        id: updatedItem._id,
        website: updatedItem.website,
        username: formData.username,
        password: formData.password,
        notes: formData.notes || '',
        category: updatedItem.category,
        favorite: updatedItem.favorite,
        iv: updatedItem.iv,
        createdAt: updatedItem.createdAt,
        updatedAt: updatedItem.updatedAt,
      };

      set((state) => ({
        items: state.items.map((item) => (item.id === id ? decryptedUpdatedItem : item)),
        loading: false,
      }));

      return { success: true };
    } catch (err) {
      set({ error: err.message || 'Failed to update vault item', loading: false });
      return { success: false, message: err.message };
    }
  },

  /**
   * Toggles favorite status of an item.
   */
  toggleFavorite: async (id) => {
    const { items } = get();
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newFavorite = !item.favorite;

    // Optimistic UI update
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, favorite: newFavorite } : i)),
    }));

    try {
      await vaultApi.updateVaultItem(id, { favorite: newFavorite });
    } catch (err) {
      // Revert if failed
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, favorite: !newFavorite } : i)),
      }));
    }
  },

  /**
   * Deletes a credential.
   */
  deleteVaultItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await vaultApi.deleteVaultItem(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        loading: false,
      }));
      return { success: true };
    } catch (err) {
      set({ error: err.message || 'Failed to delete item', loading: false });
      return { success: false, message: err.message };
    }
  },
}));
