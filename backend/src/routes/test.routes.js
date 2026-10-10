import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { UserRole } from '../models/User.js';
const router = Router();
// Endpoint accessible by any logged-in user
router.get('/me', authenticate, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Profile access granted',
        user: req.user,
    });
});
// Endpoint accessible only by RESTAURANT_OWNER
router.get('/owner-only', authenticate, authorize(UserRole.RESTAURANT_OWNER), (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the Owner Portal',
        user: req.user,
    });
});
// Endpoint accessible only by ADMIN
router.get('/admin-only', authenticate, authorize(UserRole.ADMIN), (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the Admin Control Panel',
        user: req.user,
    });
});
export default router;
