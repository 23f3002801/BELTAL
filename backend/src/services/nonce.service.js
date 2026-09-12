import crypto from 'crypto';
import { ethers } from 'ethers';

// In-memory store: walletAddress (lowercase) -> { nonce, message, checksumAddress, expiresAt, createdAt }
const nonceStore = new Map();

// Default 5 minutes validity for a challenge nonce
const NONCE_TTL_MS = 5 * 60 * 1000;

/**
 * Format a clear, tamper-evident sign-in challenge message
 */
function createAuthMessage(checksumAddress, nonce, issuedAt, expiresAt) {
  return [
    'TrustChain (BEL Defence Systems) Authentication Request',
    '',
    'Please sign this message to authenticate your wallet with TrustChain.',
    '',
    `Wallet: ${checksumAddress}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
    `Expires At: ${expiresAt}`,
  ].join('\n');
}

/**
 * Cleanup expired nonces periodically
 */
function cleanupExpired() {
  const now = Date.now();
  for (const [key, value] of nonceStore.entries()) {
    if (now > value.expiresAt) {
      nonceStore.delete(key);
    }
  }
}

// Run periodic cleanup every 5 minutes
setInterval(cleanupExpired, 5 * 60 * 1000).unref();

export const nonceService = {
  /**
   * Generates a new single-use nonce challenge for a wallet address
   * @param {string} walletAddress
   * @returns {{ nonce: string, message: string, expiresAt: string }}
   */
  generateNonce(walletAddress) {
    cleanupExpired();

    const checksumAddress = ethers.getAddress(walletAddress);
    const key = walletAddress.toLowerCase();
    const nonce = crypto.randomBytes(16).toString('hex');
    const now = Date.now();
    const expiresAtMs = now + NONCE_TTL_MS;
    const issuedAt = new Date(now).toISOString();
    const expiresAt = new Date(expiresAtMs).toISOString();

    const message = createAuthMessage(checksumAddress, nonce, issuedAt, expiresAt);

    nonceStore.set(key, {
      nonce,
      message,
      checksumAddress,
      expiresAt: expiresAtMs,
      createdAt: issuedAt,
    });

    return {
      nonce,
      message,
      expiresAt,
    };
  },

  /**
   * Retrieves an active challenge entry if valid and not expired
   * @param {string} walletAddress
   * @returns {{ nonce: string, message: string, checksumAddress: string, expiresAt: number } | null}
   */
  getStoredNonce(walletAddress) {
    const key = walletAddress.toLowerCase();
    const entry = nonceStore.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      nonceStore.delete(key);
      return null;
    }

    return entry;
  },

  /**
   * Consumes (deletes) the nonce so it cannot be used again
   * @param {string} walletAddress
   * @returns {boolean} true if an active entry was deleted
   */
  consumeNonce(walletAddress) {
    const key = walletAddress.toLowerCase();
    return nonceStore.delete(key);
  },

  /**
   * Clear all nonces (useful for testing)
   */
  clearAll() {
    nonceStore.clear();
  },
};

export default nonceService;
