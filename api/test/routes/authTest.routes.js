import express from 'express';

import authTestController from '../controllers/authTest.controller.js';
import requireAuth from '../../middleware/requireAuth.js';

const router = express.Router();

router.get('/protect', authTestController.protect);
router.get('/customer', requireAuth(['customer']), authTestController.customer);
router.get('/camera', requireAuth(['camera']), authTestController.camera);
router.get('/operator', requireAuth(['operator']), authTestController.operator);
router.get('/admin', requireAuth(['admin']), authTestController.admin);

export default router;
