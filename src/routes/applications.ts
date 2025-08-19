import { Router } from 'express';
import * as applicationsController from '../controllers/applicationsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', applicationsController.list);
router.post('/', applicationsController.create);
router.put('/:id', applicationsController.update);
router.delete('/:id', applicationsController.remove);
router.patch('/:id/move', applicationsController.move);

export default router;