import express from 'express';

import authTestController from '../controllers/authTest.controller.js';

const router = express.Router();

router.get('/protected', authTestController.protected);
router.get('/customer', authTestController.customer);
router.get('/camera', authTestController.camera);
router.get('/operator', authTestController.operator);
router.get('/admin', authTestController.admin);

export default router;
