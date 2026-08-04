import mongoose from 'mongoose';

/**
 * Allowed Vault Item Categories
 */
export const VAULT_CATEGORIES = ['Social', 'Shopping', 'Finance', 'Education', 'Work', 'Other'];

/**
 * Vault Schema
 * Stores client-side encrypted credentials.
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
    encryptedPassword: {
      type: String,
      required: [true, 'Encrypted password is required'],
    },
    encryptedNotes: {
      type: String,
      default: '',
    },
    iv: {
      type: String,
      required: [true, 'Initialization Vector (IV) is required'],
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
