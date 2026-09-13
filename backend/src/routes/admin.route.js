import express from 'express';
import authenticate from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import validate from '../middleware/validate.js';
import adminController from '../controllers/admin.controller.js';
import { registerIdentitySchema, updateRoleSchema } from '../validators/admin.validator.js';

const router = express.Router();

router.use(authenticate, requireRole('ADMIN'));

router.post('/identities', validate(registerIdentitySchema), adminController.registerIdentity);
router.patch('/identities/:id/role', validate(updateRoleSchema), adminController.updateRole);

export default router;
