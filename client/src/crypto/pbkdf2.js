/**
 * Web Crypto API PBKDF2 Key Derivation Utility
 */

const getCrypto = () => (typeof window !== 'undefined' ? window.crypto : globalThis.crypto);

/**
 * Converts a Uint8Array buffer to a Hex string.
 * @param {Uint8Array} buffer
 * @returns {string} Hex string
 */
export const bufferToHex = (buffer) => {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Converts a Hex string to a Uint8Array buffer.
 * @param {string} hexString
 * @returns {Uint8Array}
 */
export const hexToBuffer = (hexString) => {
  const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return bytes;
};

/**
 * Generates a cryptographically secure random salt (default 16 bytes = 128 bits).
 * @param {number} length - Salt length in bytes
 * @returns {string} Hex encoded salt string
 */
export const generateSalt = (length = 16) => {
  const randomBytes = new Uint8Array(length);
  getCrypto().getRandomValues(randomBytes);
  return bufferToHex(randomBytes);
};

/**
 * Derives 512 bits (64 bytes) from a master password and salt using PBKDF2 with SHA-256.
 * The derived bits are split into:
 * - 256-bit Authentication Key
 * - 256-bit Vault Encryption Key
 *
 * @param {string} masterPassword - User's master password
 * @param {string} saltHex - Cryptographic salt as hex string
 * @param {number} iterations - Iteration count (default 100,000)
 * @returns {Promise<{authKeyBytes: Uint8Array, encryptionKeyBytes: Uint8Array}>}
 */
export const deriveBitsFromMasterPassword = async (masterPassword, saltHex, iterations = 100000) => {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(masterPassword);
  const saltBytes = hexToBuffer(saltHex);
  const cryptoObj = getCrypto();

  // Import raw password as a key for PBKDF2 derivation
  const baseKey = await cryptoObj.subtle.importKey(
    'raw',
    passwordBytes,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  // Derive 512 bits (64 bytes)
  const derivedBitsBuffer = await cryptoObj.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: iterations,
      hash: 'SHA-256',
    },
    baseKey,
    512
  );

  const derivedBytes = new Uint8Array(derivedBitsBuffer);

  // First 32 bytes (256 bits) for Authentication Key
  const authKeyBytes = derivedBytes.slice(0, 32);

  // Second 32 bytes (256 bits) for Vault Encryption Key
  const encryptionKeyBytes = derivedBytes.slice(32, 64);

  return { authKeyBytes, encryptionKeyBytes };
};
