import { Router } from 'express';
import authenticate from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import auditService from '../services/audit.service.js';

const router = Router();

/**
 * GET /api/audit
 * Paginated, filterable unified audit trail (AuditEvent + PacsBadgeEvent).
 * Query params: type, actorId, targetId, txHash, from, to, page, limit
 */
router.get(
  '/',
  authenticate,
  requireRole('ADMIN', 'AUDITOR', 'MANAGER'),
  async (req, res, next) => {
    try {
      const result = await auditService.getAuditTrail(req.query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /api/audit/:id
 * Fetch a single AuditEvent by UUID.
 */
router.get(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUDITOR', 'MANAGER'),
  async (req, res, next) => {
    try {
      const event = await auditService.getAuditEventById(req.params.id);
      res.json(event);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
