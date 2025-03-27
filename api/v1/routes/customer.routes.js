
import express from 'express';

import customerEstablishmentController from '../controllers/customerEstablishment.controller.js';
import requireAuth from '../../middleware/requireAuth.js';

const router = express.Router();

router.get('/:ownerId/establishments', requireAuth('read'), customerEstablishmentController.get);
router.get('/:ownerId/establishments/:id', requireAuth('read'), customerEstablishmentController.getById);
router.post('/:ownerId/establishments', requireAuth('create'), customerEstablishmentController.create);
router.patch('/:ownerId/establishments/:id', requireAuth('update'), customerEstablishmentController.update);
router.delete('/:ownerId/establishments/:id', requireAuth('delete'), customerEstablishmentController.delete);

export default router;
