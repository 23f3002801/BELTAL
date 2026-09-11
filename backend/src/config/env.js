import 'dotenv/config';

export default {
  port: process.env.PORT || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  rpcUrl: process.env.RPC_URL,
  contractAddress: process.env.CONTRACT_ADDRESS,
  jwtSecret: process.env.JWT_SECRET,
  ipfsApiKey: process.env.IPFS_API_KEY,
};
