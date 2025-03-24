
import express from 'express';

import customerController from '../controllers/customer.controller.js';
import requireAuth from '../../middleware/requireAuth.js';

const router = express.Router();

router.get('/:ownerId/establishments', requireAuth('read'), customerController.get);
router.get('/:ownerId/establishments/:id', requireAuth('read'), customerController.getById);
router.post('/:ownerId/establishments', requireAuth('create'), customerController.create);
router.patch('/:ownerId/establishments/:id', requireAuth('update'), customerController.update);
router.delete('/:ownerId/establishments/:id', requireAuth('delete'), customerController.delete);

export default router;
