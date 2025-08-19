import { Router } from 'express';
import * as jobsController from '../controllers/jobsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', jobsController.list);
router.post('/', jobsController.create);
router.put('/:id', jobsController.update);
router.delete('/:id', jobsController.remove);

export default router;