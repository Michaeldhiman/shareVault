import Vault from '../models/Vault.js';

/**
 * Service handling Vault CRUD operations and user isolation logic.
 */

/**
 * Retrieves all vault items belonging to the authenticated user.
 * @param {string} userId
 * @returns {Promise<Array>} Array of vault documents
 */
export const getUserVaultItems = async (userId) => {
  const items = await Vault.find({ userId }).sort({ createdAt: -1 });
  return items.map((item) => item.toJSON());
};

/**
 * Creates a new encrypted vault entry.
 * @param {string} userId
 * @param {object} vaultData - { website, encryptedUsername, encryptedPassword, encryptedNotes, iv, category, favorite }
 * @returns {Promise<object>} Created vault document
 */
export const createVaultItem = async (userId, vaultData) => {
  const item = await Vault.create({
    ...vaultData,
    userId,
  });
  return item.toJSON();
};

/**
 * Updates an existing vault entry owned by the user.
 * @param {string} userId
 * @param {string} itemId
 * @param {object} updateData
 * @returns {Promise<object>} Updated vault document
 */
export const updateVaultItem = async (userId, itemId, updateData) => {
  const item = await Vault.findOne({ _id: itemId, userId });

  if (!item) {
    const error = new Error('Vault item not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  // Update provided fields
  const allowedUpdates = [
    'website',
    'encryptedUsername',
    'encryptedPassword',
    'encryptedNotes',
    'iv',
    'category',
    'favorite',
  ];

  allowedUpdates.forEach((field) => {
    if (updateData[field] !== undefined) {
      item[field] = updateData[field];
    }
  });

  await item.save();
  return item.toJSON();
};

/**
 * Deletes a vault entry owned by the user.
 * @param {string} userId
 * @param {string} itemId
 * @returns {Promise<{id: string}>}
 */
export const deleteVaultItem = async (userId, itemId) => {
  const item = await Vault.findOneAndDelete({ _id: itemId, userId });

  if (!item) {
    const error = new Error('Vault item not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  return { id: itemId };
};
