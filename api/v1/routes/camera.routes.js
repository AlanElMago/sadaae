import express from 'express';

import cameraController from '../controllers/camera.controller.js';
import requireApiKey from '../../middleware/requireApiKey.js';
import requireAuth from '../../middleware/requireAuth.js';

const router = express.Router();

router.get('/whoami', requireApiKey, cameraController.whoami);

router.get('/', requireAuth('read'), cameraController.get);
router.get('/:id', requireAuth('read'), cameraController.getById);
router.get('/by-user-id/:id', requireAuth('read'), cameraController.getByUserId);
router.get('/by-establishment-id/:id', requireAuth('read'), cameraController.getByEstablishmentId);
router.post('/', requireAuth('create'), cameraController.create);
router.patch('/:id', requireAuth('update'), cameraController.update);

export default router;
