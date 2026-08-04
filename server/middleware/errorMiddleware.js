/**
 * 404 Not Found Middleware
 * Handles requests to endpoints that do not exist.
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Global Error Handler Middleware
 * Formats errors consistently and hides stack traces in production.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};
