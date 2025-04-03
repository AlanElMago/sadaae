import express from 'express';

import upload from '../../middleware/upload.js';
import requireAuth from '../../middleware/requireAuth.js';
import geminiTestController from '../controllers/geminiTest.controller.js';

const router = express.Router();

router.post('/', requireAuth('upload'), upload.single('image'), geminiTestController.describeImage);

export default router;
