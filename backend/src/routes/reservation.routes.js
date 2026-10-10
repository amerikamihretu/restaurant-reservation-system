import { Router } from 'express';
import { createReservation, getMyReservations, getOwnerReservations, updateReservationStatus, } from '../controllers/reservation.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validate.js';
import { UserRole } from '../models/User.js';
import { createReservationSchema, updateReservationStatusSchema, } from '../validators/reservation.validator.js';
const router = Router();
// Customer Routes
router.post('/', authenticate, authorize(UserRole.CUSTOMER), validate(createReservationSchema), createReservation);
router.get('/mine', authenticate, authorize(UserRole.CUSTOMER), getMyReservations);
// Owner Routes
router.get('/owner/list', authenticate, authorize(UserRole.RESTAURANT_OWNER), getOwnerReservations);
// Status Management (Customer or Owner)
router.patch('/:id/status', authenticate, authorize(UserRole.CUSTOMER, UserRole.RESTAURANT_OWNER), validate(updateReservationStatusSchema), updateReservationStatus);
export default router;
