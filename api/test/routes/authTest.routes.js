import express from 'express';

import authTestController from '../controllers/authTest.controller.js';

const router = express.Router();

router.get('/protect', authTestController.protect);

export default router;
