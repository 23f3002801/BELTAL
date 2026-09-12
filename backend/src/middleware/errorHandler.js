import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  logger.error(`${message} (status ${status})`);
  res.status(status).json({ error: { message, status } });
};

export default errorHandler;
