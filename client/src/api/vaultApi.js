import axiosClient from './axiosClient';

/**
 * Vault API Service methods
 */
export const vaultApi = {
  /**
   * Fetches all encrypted vault credentials.
   */
  getVault: () => axiosClient.get('/vault'),

  /**
   * Creates a new encrypted vault entry.
   * @param {object} payload - { website, encryptedUsername, encryptedPassword, encryptedNotes, iv, category, favorite }
   */
  createVaultItem: (payload) => axiosClient.post('/vault', payload),

  /**
   * Updates an existing vault entry.
   * @param {string} id
   * @param {object} payload
   */
  updateVaultItem: (id, payload) => axiosClient.put(`/vault/${id}`, payload),

  /**
   * Deletes a vault entry.
   * @param {string} id
   */
  deleteVaultItem: (id) => axiosClient.delete(`/vault/${id}`),
};
