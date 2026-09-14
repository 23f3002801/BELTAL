import express from 'express';
import authenticate from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import validate from '../middleware/validate.js';
import machineIngestLimiter from '../middleware/machineRateLimit.js';
import pacsController from '../controllers/pacs.controller.js';
import { badgeEventSchema } from '../validators/pacs.validator.js';

const router = express.Router();

/**
 * Badge-tap ingest — invoked on every PACS reader event. Machine-only
 * (ROLE_SYSTEM_CONNECTOR), with its own rate limit distinct from the human
 * apiLimiter in app.js (issue #74).
 */
router.post(
  '/badge-event',
  machineIngestLimiter,
  authenticate,
  requireRole('SYSTEM_CONNECTOR'),
  validate(badgeEventSchema),
  pacsController.badgeEvent
);

export default router;
