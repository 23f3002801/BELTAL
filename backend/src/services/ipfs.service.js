import config from '../config/env.js';
import logger from '../config/logger.js';
import ApiError from '../utils/ApiError.js';

const PINATA_PIN_JSON_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export const ipfsService = {
  isConfigured() {
    return Boolean(config.pinataJwt);
  },

  /**
   * Pins a JSON-serializable payload to IPFS via Pinata and returns its CID.
   * Callers are responsible for encrypting anything PII before it gets here —
   * this helper doesn't know or care what the payload contains.
   */
  async pinJson(payload, { name } = {}) {
    if (!this.isConfigured()) {
      throw new ApiError(503, 'IPFS/Pinata is not configured (PINATA_JWT missing)');
    }

    const response = await fetch(PINATA_PIN_JSON_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.pinataJwt}`,
      },
      body: JSON.stringify({
        pinataContent: payload,
        ...(name ? { pinataMetadata: { name } } : {}),
      }),
    });

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
