import express from 'express';
import rateLimit from 'express-rate-limit';
import { getSalt, register, login, logout } from '../controllers/authController.js';
import { registerValidator, loginValidator, saltQueryValidator } from '../validators/authValidator.js';

const router = express.Router();

// Rate limiting on authentication routes (50 requests per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
    error: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/salt', authLimiter, saltQueryValidator, getSalt);
router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);
router.post('/logout', logout);

export default router;
