import logger from '../config/logger.js';

const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`);
  });

  next();
};

export default requestLogger;
