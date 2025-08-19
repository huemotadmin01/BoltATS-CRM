import { Router } from 'express';
import * as opportunitiesController from '../controllers/opportunitiesController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', opportunitiesController.list);
router.post('/', opportunitiesController.create);
router.put('/:id', opportunitiesController.update);
router.delete('/:id', opportunitiesController.remove);

export default router;