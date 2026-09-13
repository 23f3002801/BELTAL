import 'dotenv/config';
import crypto from 'crypto';

// One service-level secret (like JWT_SECRET), not per-user. In production this
// would come from a KMS/secrets manager via envelope encryption (a master key
// wraps a small per-record data key, so rotation doesn't mean re-encrypting
// every dossier) with a distinct key per environment — never this literal
// process.env read against a plaintext .env file.
let dossierEncryptionKey = process.env.DOSSIER_ENCRYPTION_KEY;
if (!dossierEncryptionKey) {
  dossierEncryptionKey = crypto.randomBytes(32).toString('hex');
  console.warn(
    'DOSSIER_ENCRYPTION_KEY is unset — generated an ephemeral dev key; encrypted PII dossiers will not be decryptable after a restart. Set DOSSIER_ENCRYPTION_KEY (32-byte hex) in .env for real use.'
  );
}

export default {
  port: process.env.PORT || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  rpcUrl: process.env.RPC_URL,
  contractAddress: process.env.CONTRACT_ADDRESS,
  jwtSecret: process.env.JWT_SECRET || 'trustchain-dev-secret-key-32chars-min-len',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  ipfsApiKey: process.env.IPFS_API_KEY,
  pinataJwt: process.env.PINATA_JWT,
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataApiSecret: process.env.PINATA_API_SECRET,
  pinataGateway: process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs',
  dossierEncryptionKey,
};
