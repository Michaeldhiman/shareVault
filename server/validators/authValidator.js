import { body, query, validationResult } from 'express-validator';

/**
 * Validation Result Middleware
 * Intercepts express-validator errors and returns consistent 400 response.
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg).join(', ');
    res.status(400);
    return next(new Error(`Validation Error: ${errorMessages}`));
  }
  next();
};

/**
 * Register Input Validation Rules
 */
export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('authHash')
    .notEmpty()
    .withMessage('Authentication hash is required'),
  body('salt')
    .notEmpty()
    .withMessage('Cryptographic salt is required'),
  validateRequest,
];

/**
 * Login Input Validation Rules
 */
export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('authHash')
    .notEmpty()
    .withMessage('Authentication hash is required'),
  validateRequest,
];

/**
 * Salt Fetch Query Validation Rules
 */
export const saltQueryValidator = [
  query('email')
    .trim()
    .notEmpty()
    .withMessage('Email query parameter is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  validateRequest,
];

/**
 * Profile Update Validation Rules
 */
export const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  validateRequest,
];
