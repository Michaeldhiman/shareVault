import mongoose from 'mongoose';

/**
 * User Schema
 * Represents an authenticated user in SecureVault.
 * Note: Never stores plaintext passwords or vault encryption keys.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    authHash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true, // Required for vault PBKDF2 encryption key derivation
    },


  },
  {
    timestamps: true,
  }
);

// Format user JSON output to exclude sensitive security hashes
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.authHash;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model('User', userSchema);
export default User;
