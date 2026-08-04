import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import vaultRoutes from './routes/vaultRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security HTTP Headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS) Configuration
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

// Global Rate Limiting (500 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    error: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// JSON Body Parser
app.use(express.json({ limit: '10kb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SecureVault Backend API is running safely.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/vault', vaultRoutes);

// Centralized 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
