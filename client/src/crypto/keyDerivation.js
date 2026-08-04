import { generateSalt, deriveBitsFromMasterPassword, bufferToHex } from './pbkdf2.js';
import { importEncryptionKey } from './aes.js';

/**
 * Hashes raw Authentication Key bytes using SHA-256 to create the server-facing authHash verifier.
 * @param {Uint8Array} authKeyBytes
 * @returns {Promise<string>} Hex encoded SHA-256 hash string
 */
export const hashAuthKey = async (authKeyBytes) => {
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', authKeyBytes);
  return bufferToHex(new Uint8Array(hashBuffer));
};

/**
 * High-Level Key Derivation Orchestrator
 * Given a Master Password and optional Salt:
 * 1. Generates salt if not provided.
 * 2. Derives Authentication Key & Encryption Key via PBKDF2 (100k iterations).
 * 3. Hashes Authentication Key with SHA-256 to produce authHash.
 * 4. Imports Encryption Key into AES-GCM CryptoKey format.
 *
 * @param {string} masterPassword
 * @param {string|null} existingSalt - Hex salt string (if logging in) or null (if registering)
 * @returns {Promise<{authHash: string, encryptionKey: CryptoKey, salt: string}>}
 */
export const deriveClientKeys = async (masterPassword, existingSalt = null) => {
  const salt = existingSalt || generateSalt();

  const { authKeyBytes, encryptionKeyBytes } = await deriveBitsFromMasterPassword(
    masterPassword,
    salt
  );

  // Derive authHash sent to backend for authentication
  const authHash = await hashAuthKey(authKeyBytes);

  // Import Vault Encryption Key for client-side AES-GCM operations
  const encryptionKey = await importEncryptionKey(encryptionKeyBytes);

  return {
    authHash,
    encryptionKey,
    salt,
  };
};
