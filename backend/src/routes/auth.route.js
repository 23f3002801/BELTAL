import express from 'express';
import authController from '../controllers/authController.js';
import validate from '../middleware/validate.js';
import { nonceSchema, verifySchema } from '../validators/authValidator.js';

const router = express.Router();

// Request single-use challenge nonce
router.post('/nonce', validate(nonceSchema), authController.getNonce);

// Verify signature and issue JWT
router.post('/verify', validate(verifySchema), authController.verify);
router.post('/login', validate(verifySchema), authController.verify);

export default router;
