/**
 * Web Crypto API AES-GCM 256-bit Encryption & Decryption Utility
 */

const getCrypto = () => (typeof window !== 'undefined' ? window.crypto : globalThis.crypto);

/**
 * Converts ArrayBuffer / Uint8Array to Base64 string.
 */
export const bufferToBase64 = (buffer) => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(buffer).toString('base64');
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return (typeof window !== 'undefined' ? window.btoa : globalThis.btoa)(binary);
};

/**
 * Converts Base64 string to Uint8Array.
 */
export const base64ToBuffer = (base64) => {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  const binaryString = (typeof window !== 'undefined' ? window.atob : globalThis.atob)(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Imports raw 256-bit key bytes into an AES-GCM CryptoKey object.
 * @param {Uint8Array} rawBytes - 32-byte array
 * @returns {Promise<CryptoKey>}
 */
export const importEncryptionKey = async (rawBytes) => {
  return await getCrypto().subtle.importKey(
    'raw',
    rawBytes,
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Generates a fresh cryptographically secure random 12-byte IV for AES-GCM.
 * @returns {Uint8Array}
 */
export const generateIV = () => {
  const ivBytes = new Uint8Array(12);
  getCrypto().getRandomValues(ivBytes);
  return ivBytes;
};

/**
 * Encrypts plaintext string using AES-GCM.
 * @param {string} plaintext - Plain text to encrypt
 * @param {CryptoKey} cryptoKey - AES-GCM CryptoKey
 * @param {Uint8Array|null} customIvBytes - Optional 12-byte IV array to share across fields in the same record
 * @returns {Promise<{ciphertext: string, iv: string}>} Base64 encoded ciphertext & IV
 */
export const encryptText = async (plaintext, cryptoKey, customIvBytes = null) => {
  if (!plaintext) {
    return { ciphertext: '', iv: '' };
  }

  const ivBytes = customIvBytes || generateIV();

  const encoder = new TextEncoder();
  const plaintextBytes = encoder.encode(plaintext);

  const encryptedBuffer = await getCrypto().subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
    },
    cryptoKey,
    plaintextBytes
  );

  return {
    ciphertext: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(ivBytes),
  };
};

/**
 * Decrypts AES-GCM Base64 encoded ciphertext using the provided CryptoKey and IV.
 * @param {string} ciphertextBase64 - Base64 encoded ciphertext
 * @param {string} ivBase64 - Base64 encoded IV
 * @param {CryptoKey} cryptoKey - AES-GCM CryptoKey
 * @returns {Promise<string>} Plaintext string
 */
export const decryptText = async (ciphertextBase64, ivBase64, cryptoKey) => {
  if (!ciphertextBase64) return '';
  if (!ivBase64) throw new Error('Missing Initialization Vector for decryption');

  const ciphertextBytes = base64ToBuffer(ciphertextBase64);
  const ivBytes = base64ToBuffer(ivBase64);

  const decryptedBuffer = await getCrypto().subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
    },
    cryptoKey,
    ciphertextBytes
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
};
