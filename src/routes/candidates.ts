import { Router } from 'express';
import * as candidatesController from '../controllers/candidatesController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', candidatesController.list);
router.post('/', candidatesController.create);
router.put('/:id', candidatesController.update);
router.delete('/:id', candidatesController.remove);

export default router;