import { body, param } from 'express-validator';
import { validateRequest } from './authValidator.js';
import { VAULT_CATEGORIES } from '../models/Vault.js';

/**
 * Validator for URL param :id
 */
export const vaultIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid vault item ID format'),
  validateRequest,
];

/**
 * Validator for creating a new vault entry
 */
export const createVaultValidator = [
  body('website')
    .trim()
    .notEmpty()
    .withMessage('Website is required')
    .isLength({ max: 200 })
    .withMessage('Website length cannot exceed 200 characters'),
  body('encryptedUsername')
    .notEmpty()
    .withMessage('Encrypted username is required'),
  body('encryptedPassword')
    .notEmpty()
    .withMessage('Encrypted password is required'),
  body('encryptedNotes')
    .optional()
    .isString()
    .withMessage('Encrypted notes must be a string'),
  body('iv')
    .notEmpty()
    .withMessage('Initialization Vector (IV) is required'),
  body('category')
    .optional()
    .isIn(VAULT_CATEGORIES)
    .withMessage(`Category must be one of: ${VAULT_CATEGORIES.join(', ')}`),
  body('favorite')
    .optional()
    .isBoolean()
    .withMessage('Favorite must be a boolean value'),
  validateRequest,
];

/**
 * Validator for updating an existing vault entry
 */
export const updateVaultValidator = [
  ...vaultIdParamValidator,
  body('website')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Website cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Website length cannot exceed 200 characters'),
  body('encryptedUsername')
    .optional()
    .notEmpty()
    .withMessage('Encrypted username cannot be empty'),
  body('encryptedPassword')
    .optional()
    .notEmpty()
    .withMessage('Encrypted password cannot be empty'),
  body('encryptedNotes')
    .optional()
    .isString()
    .withMessage('Encrypted notes must be a string'),
  body('iv')
    .optional()
    .notEmpty()
    .withMessage('Initialization Vector (IV) cannot be empty'),
  body('category')
    .optional()
    .isIn(VAULT_CATEGORIES)
    .withMessage(`Category must be one of: ${VAULT_CATEGORIES.join(', ')}`),
  body('favorite')
    .optional()
    .isBoolean()
    .withMessage('Favorite must be a boolean value'),
  validateRequest,
];
