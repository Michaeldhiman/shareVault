import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { updateProfileValidator } from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user profile routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfileValidator, updateProfile);

export default router;
