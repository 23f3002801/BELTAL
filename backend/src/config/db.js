import { PrismaClient } from '@prisma/client';
import logger from './logger.js';
import config from './env.js';

let prisma = null;

try {
  if (config.databaseUrl) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  } else {
    logger.warn('DATABASE_URL is not set — database features will run in decoupled/fallback mode.');
  }
} catch (err) {
  logger.warn(`Failed to initialize Prisma client: ${err.message}`);
}

export default prisma;
