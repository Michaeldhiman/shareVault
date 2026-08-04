import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import vaultRoutes from './routes/vaultRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security HTTP Headers
app.use(helmet());

// Cookie Parser Middleware for HttpOnly Cookie Authentication
app.use(cookieParser());

// HTTP Request Logger (Morgan)
const isProduction = process.env.NODE_ENV === 'production';
app.use(morgan(isProduction ? 'combined' : 'dev'));

// Cross-Origin Resource Sharing (CORS) Configuration
const rawOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const formattedOrigin = rawOrigin.startsWith('http://') || rawOrigin.startsWith('https://')
  ? rawOrigin
  : `https://${rawOrigin}`;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      if (
        origin === formattedOrigin ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, formattedOrigin);
    },
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
