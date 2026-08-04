import mongoose from 'mongoose';

/**
 * Allowed Vault Item Categories
 */
export const VAULT_CATEGORIES = ['Social', 'Shopping', 'Finance', 'Education', 'Work', 'Other'];

/**
 * Vault Schema
 * Stores client-side encrypted credentials.
 * Cryptographic Rule: Every encrypted field MUST have its own unique random IV.
 * The backend never has access to plaintext username, password, or notes.
 */
const vaultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    website: {
      type: String,
      required: [true, 'Website/Service name is required'],
      trim: true,
    },
    encryptedUsername: {
      type: String,
      required: [true, 'Encrypted username is required'],
    },
    usernameIv: {
      type: String,
      default: '',
    },
    encryptedPassword: {
      type: String,
      required: [true, 'Encrypted password is required'],
    },
    passwordIv: {
      type: String,
      default: '',
    },
    encryptedNotes: {
      type: String,
      default: '',
    },
    notesIv: {
      type: String,
      default: '',
    },
    // Fallback single iv for legacy schema records
    iv: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: {
        values: VAULT_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
      default: 'Work',
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Format JSON output to exclude internal mongoose versioning __v
vaultSchema.methods.toJSON = function () {
  const vaultObject = this.toObject();
  delete vaultObject.__v;
  return vaultObject;
};

const Vault = mongoose.model('Vault', vaultSchema);
export default Vault;
