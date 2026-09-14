import config from '../config/env.js';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';

const PINATA_PIN_JSON_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export const ipfsService = {
  isConfigured() {
    return Boolean(config.pinataJwt || (config.pinataApiKey && config.pinataApiSecret));
  },

  /**
   * Pins a JSON-serializable payload to IPFS via Pinata and returns its CID.
   * Callers are responsible for encrypting anything PII before it gets here —
   * this helper doesn't know or care what the payload contains.
   */
  async pinJson(payload, { name } = {}) {
    if (!this.isConfigured()) {
      throw new ApiError(503, 'IPFS/Pinata is not configured (PINATA_JWT or PINATA_API_KEY/SECRET missing)');
    }

    const getHeaders = (useApiKey = false) => {
      const headers = { 'Content-Type': 'application/json' };
      if (!useApiKey && config.pinataJwt) {
        headers.Authorization = `Bearer ${config.pinataJwt}`;
      } else if (config.pinataApiKey && config.pinataApiSecret) {
        headers.pinata_api_key = config.pinataApiKey;
        headers.pinata_secret_api_key = config.pinataApiSecret;
      }
      return headers;
    };

    const body = JSON.stringify({
      pinataContent: payload,
      ...(name ? { pinataMetadata: { name } } : {}),
    });

    let response = await fetch(PINATA_PIN_JSON_URL, {
      method: 'POST',
      headers: getHeaders(false),
      body,
    });

    // If JWT failed and API key/secret are available, retry with API key/secret
    if (!response.ok && config.pinataApiKey && config.pinataApiSecret && config.pinataJwt) {
      logger.warn('Pinata JWT auth failed, retrying with PINATA_API_KEY and PINATA_API_SECRET...');
      response = await fetch(PINATA_PIN_JSON_URL, {
        method: 'POST',
        headers: getHeaders(true),
        body,
      });
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      logger.error(`Pinata pin failed: ${response.status} ${text}`);
      throw new ApiError(502, 'Failed to pin dossier to IPFS');
    }

    const data = await response.json();
    return data.IpfsHash;
  },
};

export default ipfsService;
