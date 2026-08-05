/**
 * Password Reuse Detector — Client-Side Only
 *
 * All processing happens in browser memory after vault decryption.
 * Plaintext passwords are NEVER exposed in the returned data structure.
 * SHA-256 hashes are computed via the Web Crypto API and kept in memory only.
 *
 * Algorithm complexity:
 *   Time:   O(n)  — single pass to build hash→accounts map
 *   Memory: O(n)  — one entry per credential
 */

/**
 * Computes a SHA-256 hex digest of the given string using the Web Crypto API.
 * Returns an empty string for null/empty/error-state values so they are never grouped.
 *
 * @param {string} text
 * @returns {Promise<string>} hex digest or ''
 */
async function sha256(text) {
  if (!text || text === '[Decryption Error]') return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return '';
  }
}

/**
 * Analyzes a decrypted vault items array and detects password reuse.
 *
 * Input items must have: { id, website, username, password }
 * The returned structure NEVER contains plaintext passwords.
 *
 * @param {Array<{id: string, website: string, username: string, password: string}>} items
 * @returns {Promise<ReuseReport>}
 *
 * @typedef {Object} ReuseAccount
 * @property {string} id
 * @property {string} website
 * @property {string} username
 *
 * @typedef {Object} ReuseGroup
 * @property {string} hash         - SHA-256 hex (for React key, never exposed as password)
 * @property {ReuseAccount[]} accounts
 *
 * @typedef {Object} ReuseReport
 * @property {ReuseGroup[]} reusedGroups
 * @property {number} totalGroups            - number of distinct reused-password groups
 * @property {number} totalAffectedAccounts  - total credentials sharing a reused password
 * @property {number} uniquePasswords        - passwords that appear exactly once
 * @property {number} totalCredentials
 */
export async function detectPasswordReuse(items) {
  if (!items || items.length === 0) {
    return {
      reusedGroups: [],
      totalGroups: 0,
      totalAffectedAccounts: 0,
      uniquePasswords: 0,
      totalCredentials: 0,
    };
  }

  // O(n) pass: compute hashes concurrently
  const hashed = await Promise.all(
    items.map(async (item) => ({
      hash: await sha256(item.password),
      account: {
        id: item.id,
        website: item.website,
        username: item.username,
      },
    }))
  );

  // O(n) grouping: bucket by hash
  /** @type {Map<string, ReuseAccount[]>} */
  const buckets = new Map();
  for (const { hash, account } of hashed) {
    if (!hash) continue; // skip empty/error passwords
    if (!buckets.has(hash)) buckets.set(hash, []);
    buckets.get(hash).push(account);
  }

  // Extract reused groups (bucket size > 1)
  const reusedGroups = [];
  let uniquePasswords = 0;

  for (const [hash, accounts] of buckets) {
    if (accounts.length > 1) {
      reusedGroups.push({ hash, accounts });
    } else {
      uniquePasswords++;
    }
  }

  const totalAffectedAccounts = reusedGroups.reduce(
    (sum, g) => sum + g.accounts.length,
    0
  );

  return {
    reusedGroups,
    totalGroups: reusedGroups.length,
    totalAffectedAccounts,
    uniquePasswords,
    totalCredentials: items.length,
  };
}
