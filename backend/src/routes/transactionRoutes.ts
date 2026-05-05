import { Router } from 'express';
import { getMyTransactions, transfer, deposit, withdraw, getSummary } from '../controllers/transactionController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { transferSchema, depositSchema, withdrawSchema } from '../utils/validation';

const router = Router();
router.use(protect);
router.get('/',            getMyTransactions);
router.get('/summary',     getSummary);
router.post('/transfer',   validate(transferSchema), transfer);
router.post('/deposit',    validate(depositSchema),  deposit);
router.post('/withdraw',   validate(withdrawSchema), withdraw);
export default router;