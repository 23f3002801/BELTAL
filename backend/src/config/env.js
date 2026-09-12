import 'dotenv/config';

export default {
  port: process.env.PORT || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  rpcUrl: process.env.RPC_URL,
  contractAddress: process.env.CONTRACT_ADDRESS,
  jwtSecret: process.env.JWT_SECRET || 'trustchain-dev-secret-key-32chars-min-len',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  ipfsApiKey: process.env.PINATA_JWT || process.env.IPFS_API_KEY,
  pinataJwt: process.env.PINATA_JWT || process.env.IPFS_API_KEY,
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataApiSecret: process.env.PINATA_API_SECRET,
  pinataGateway: process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs',
};
