
import express from 'express';

import customerCameraController from '../controllers/customerCamera.controller.js';
import customerEstablishmentController from '../controllers/customerEstablishment.controller.js';
import requireAuth from '../../middleware/requireAuth.js';

const router = express.Router();

router.get('/:ownerId/establishments', requireAuth('read'), customerEstablishmentController.get);
router.get('/:ownerId/establishments/:id', requireAuth('read'), customerEstablishmentController.getById);
router.post('/:ownerId/establishments', requireAuth('create'), customerEstablishmentController.create);
router.patch('/:ownerId/establishments/:id', requireAuth('update'), customerEstablishmentController.update);
router.delete('/:ownerId/establishments/:id', requireAuth('delete'), customerEstablishmentController.delete);

router.get('/:ownerId/cameras', requireAuth('read'), customerCameraController.get);
router.get('/:ownerId/cameras/:id', requireAuth('read'), customerCameraController.getById);
router.post('/:ownerId/cameras', requireAuth('activate'), customerCameraController.activate);
router.patch('/:ownerId/cameras/:id', requireAuth('update'), customerCameraController.update);
router.patch('/:ownerId/cameras/:id/assign-establishment', requireAuth('update'), customerCameraController.assignEstablishment);

export default router;
