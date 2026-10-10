import { Router } from 'express';
import { createRestaurant, getMyRestaurant, updateMyRestaurant, getApprovedRestaurants, getRestaurantById, getAdminRestaurants, updateApprovalStatus, } from '../controllers/restaurant.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validate.js';
import { UserRole } from '../models/User.js';
import { createRestaurantSchema, updateRestaurantSchema, updateApprovalStatusSchema, } from '../validators/restaurant.validator.js';
const router = Router();
// Public Routes
router.get('/', getApprovedRestaurants);
// Protected Owner Routes
router.post('/', authenticate, authorize(UserRole.RESTAURANT_OWNER), validate(createRestaurantSchema), // <--- Validation middleware added here
createRestaurant);
router.get('/mine/profile', authenticate, authorize(UserRole.RESTAURANT_OWNER), getMyRestaurant);
router.put('/mine/profile', authenticate, authorize(UserRole.RESTAURANT_OWNER), validate(updateRestaurantSchema), // <--- Validation middleware added here
updateMyRestaurant);
// Protected Admin Routes
router.get('/admin/list', authenticate, authorize(UserRole.ADMIN), getAdminRestaurants);
router.patch('/:id/approval', authenticate, authorize(UserRole.ADMIN), validate(updateApprovalStatusSchema), // <--- Validation middleware added here
updateApprovalStatus);
router.get('/:id', getRestaurantById);
export default router;
