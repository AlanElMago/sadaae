import express from 'express';

import requireAuth from '../../middleware/requireAuth.js';
import imageController from '../controllers/image.controller.js';

const router = express.Router();

router.get('/:fid', requireAuth(), imageController.download);

export default router;
