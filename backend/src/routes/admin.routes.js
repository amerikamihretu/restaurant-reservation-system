import { Router } from 'express';
import { getPlatformAnalytics, getAllUsers, updateUserStatus } from '../controllers/admin.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validate.js';
import { UserRole } from '../models/User.js';
import { updateUserStatusSchema } from '../validators/admin.validator.js';
const router = Router();
// Apply authentication & admin authorization globally to all admin routes
router.use(authenticate, authorize(UserRole.ADMIN));
router.get('/analytics', getPlatformAnalytics);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', validate(updateUserStatusSchema), updateUserStatus);
export default router;
