// In-memory session cache to avoid duplicate API requests
const sessionCache = new Map();

/**
 * Checks a password against the Have I Been Pwned (HIBP) database using k-Anonymity.
 * Ensure plaintext passwords or full hashes are NEVER transmitted outside the browser.
 * Only the first 5 characters of the SHA-1 hash are sent.
 *
 * @param {string} password - The plaintext password to check
 * @returns {Promise<{found: boolean, breachCount: number, checkedAt: Date, source: string, error: boolean, errorMessage: string|null}>}
 */
export async function checkPasswordBreach(password) {
  if (!password || password === '[Decryption Error]') {
    return {
      found: false,
      breachCount: 0,
      checkedAt: new Date(),
      source: 'HIBP',
      error: false,
      errorMessage: null,
    };
  }

  // 1. Check in-memory cache first
  if (sessionCache.has(password)) {
    return sessionCache.get(password);
  }

  try {
    // 2. Generate SHA-1 hash locally in browser using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fullHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    // 3. Extract prefix (first 5 characters) and suffix (remaining 35 characters)
    const prefix = fullHash.substring(0, 5);
    const suffix = fullHash.substring(5);

    // 4. Query the HIBP range API (CORS is supported on this endpoint)
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error(`HIBP API returned status code ${response.status}`);
    }

    const text = await response.text();

    // 5. Look for the suffix in the returned list (Format: SUFFIX:COUNT\r\n)
    const lines = text.split('\n');
    let breachCount = 0;
    let found = false;

    for (const line of lines) {
      const parts = line.trim().split(':');
      if (parts[0] === suffix) {
        found = true;
        breachCount = parseInt(parts[1], 10) || 0;
        break;
      }
    }

    const result = {
      found,
      breachCount,
      checkedAt: new Date(),
      source: 'HIBP',
      error: false,
      errorMessage: null,
    };

    // Cache the result for this session
    sessionCache.set(password, result);
    return result;
  } catch (err) {
    return {
      found: false,
      breachCount: 0,
      checkedAt: new Date(),
      source: 'HIBP',
      error: true,
      errorMessage: err.message || 'Network error',
    };
  }
}

/**
 * Clears the session cache (called when vault is locked or logged out)
 */
export function clearHibpCache() {
  sessionCache.clear();
}
