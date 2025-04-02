import express from 'express';

import fileTestController from '../controllers/fileTest.controller.js';
import requireAuth from '../../middleware/requireAuth.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.get('/download-image/:fid', requireAuth('read'), fileTestController.downloadImage);
router.post('/upload-image', requireAuth('upload'), upload.single('image'), fileTestController.uploadImage);

export default router;
