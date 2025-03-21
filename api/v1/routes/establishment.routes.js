import express from 'express';

import establishmentController from '../controllers/establishment.controller.js';
import requireAuth from '../../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth('read'), establishmentController.get);
router.get('/:id', requireAuth('read'), establishmentController.getById);
router.get('/by-user-id/:id', requireAuth('read'), establishmentController.getByUserId);
router.post('/', requireAuth('create'), establishmentController.create);
router.patch('/:id', requireAuth('update'), establishmentController.update);
router.delete('/:id', requireAuth('delete'), establishmentController.delete);

export default router;
