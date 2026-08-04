import * as vaultService from '../services/vaultService.js';

/**
 * Controller handling Vault endpoints.
 */

/**
 * GET /api/vault
 * Retrieve all encrypted credentials for logged-in user.
 */
export const getVault = async (req, res, next) => {
  try {
    const items = await vaultService.getUserVaultItems(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Vault items retrieved successfully',
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/vault
 * Create a new encrypted credential.
 */
export const createVault = async (req, res, next) => {
  try {
    const item = await vaultService.createVaultItem(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: 'Vault item created successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/vault/:id
 * Update an existing credential.
 */
export const updateVault = async (req, res, next) => {
  try {
    const item = await vaultService.updateVaultItem(req.user._id, req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Vault item updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/vault/:id
 * Delete a credential.
 */
export const deleteVault = async (req, res, next) => {
  try {
    const result = await vaultService.deleteVaultItem(req.user._id, req.params.id);

    res.status(200).json({
      success: true,
      message: 'Vault item deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
