import { create } from 'zustand';
import { vaultApi } from '../api/vaultApi';
import { encryptText, decryptText } from '../crypto/aes';

/**
 * Vault Zustand Store
 * Handles encrypted API requests and transparent client-side field decryption/encryption.
 * Cryptographic Rule: Every encrypted field gets its OWN unique 12-byte random IV.
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

      // Decrypt items locally in browser using per-field IVs
      const decryptedItems = await Promise.all(
        rawItems.map(async (item) => {
          try {
            const usernameIv = item.usernameIv || item.iv;
            const passwordIv = item.passwordIv || item.iv;
            const notesIv = item.notesIv || item.iv;

            const username = await decryptText(item.encryptedUsername, usernameIv, encryptionKey);
            const password = await decryptText(item.encryptedPassword, passwordIv, encryptionKey);
            const notes = item.encryptedNotes
              ? await decryptText(item.encryptedNotes, notesIv, encryptionKey)
              : '';

            return {
              id: item._id,
              website: item.website,
              username,
              password,
              notes,
              category: item.category || 'Work',
              favorite: !!item.favorite,
              usernameIv,
              passwordIv,
              notesIv,
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
   * Encrypts fields and creates a new vault credential using unique IVs per field.
   */
  addVaultItem: async (formData, encryptionKey) => {
    if (!encryptionKey) return { success: false, message: 'Vault is locked' };

    set({ loading: true, error: null });
    try {
      // Generate a UNIQUE 12-byte IV for every single field independently (prevents stream cipher reuse)
      const usernameEnc = await encryptText(formData.username, encryptionKey);
      const passwordEnc = await encryptText(formData.password, encryptionKey);
      const notesEnc = formData.notes
        ? await encryptText(formData.notes, encryptionKey)
        : { ciphertext: '', iv: '' };

      const payload = {
        website: formData.website,
        encryptedUsername: usernameEnc.ciphertext,
        usernameIv: usernameEnc.iv,
        encryptedPassword: passwordEnc.ciphertext,
        passwordIv: passwordEnc.iv,
        encryptedNotes: notesEnc.ciphertext,
        notesIv: notesEnc.iv,
        iv: usernameEnc.iv, // legacy fallback
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
        usernameIv: newItem.usernameIv,
        passwordIv: newItem.passwordIv,
        notesIv: newItem.notesIv,
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
   * Encrypts fields and updates an existing credential using unique IVs per field.
   */
  updateVaultItem: async (id, formData, encryptionKey) => {
    if (!encryptionKey) return { success: false, message: 'Vault is locked' };

    set({ loading: true, error: null });
    try {
      const usernameEnc = await encryptText(formData.username, encryptionKey);
      const passwordEnc = await encryptText(formData.password, encryptionKey);
      const notesEnc = formData.notes
        ? await encryptText(formData.notes, encryptionKey)
        : { ciphertext: '', iv: '' };

      const payload = {
        website: formData.website,
        encryptedUsername: usernameEnc.ciphertext,
        usernameIv: usernameEnc.iv,
        encryptedPassword: passwordEnc.ciphertext,
        passwordIv: passwordEnc.iv,
        encryptedNotes: notesEnc.ciphertext,
        notesIv: notesEnc.iv,
        iv: usernameEnc.iv,
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
        usernameIv: updatedItem.usernameIv,
        passwordIv: updatedItem.passwordIv,
        notesIv: updatedItem.notesIv,
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
