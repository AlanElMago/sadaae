import express from 'express';

import upload from '../../middleware/upload.js';
import requireApiKey from '../../middleware/requireApiKey.js';
import reportController from '../controllers/report.controller.js';

const router = express.Router();

router.post('/', requireApiKey, upload.single('photo'), reportController.submit);

export default router;
