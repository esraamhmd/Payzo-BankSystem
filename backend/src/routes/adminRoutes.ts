import { Router } from 'express';
import { getAllUsers, updateUser, getAllTransactions, getStats } from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateUserSchema } from '../utils/validation';

const router = Router();
router.use(protect, authorize('admin'));
router.get('/stats',        getStats);
router.get('/users',        getAllUsers);
router.put('/users/:id',    validate(updateUserSchema), updateUser);
router.get('/transactions', getAllTransactions);
export default router;