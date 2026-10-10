import { Router } from 'express';
import { createTable, getMyTables, getAvailableSlots, updateTable, deleteTable } from '../controllers/table.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validate.js';
import { UserRole } from '../models/User.js';
import { createTableSchema, updateTableSchema } from '../validators/table.validator.js';
const router = Router();
// Public route to inspect available reservation slots
router.get('/:restaurantId/available-slots', getAvailableSlots);
// Owner Table Management Routes
router.post('/mine/tables', authenticate, authorize(UserRole.RESTAURANT_OWNER), validate(createTableSchema), createTable);
router.get('/mine/tables', authenticate, authorize(UserRole.RESTAURANT_OWNER), getMyTables);
router.patch('/mine/tables/:id', authenticate, authorize(UserRole.RESTAURANT_OWNER), validate(updateTableSchema), updateTable);
router.delete('/mine/tables/:id', authenticate, authorize(UserRole.RESTAURANT_OWNER), deleteTable);
export default router;
