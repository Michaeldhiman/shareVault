import express from 'express';
import { getVault, createVault, updateVault, deleteVault } from '../controllers/vaultController.js';
import { createVaultValidator, updateVaultValidator, vaultIdParamValidator } from '../validators/vaultValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce JWT authentication on all vault routes
router.use(protect);

router.route('/')
  .get(getVault)
  .post(createVaultValidator, createVault);

router.route('/:id')
  .put(updateVaultValidator, updateVault)
  .delete(vaultIdParamValidator, deleteVault);

export default router;
