import express from 'express';

import upload from '../../middleware/upload.js';
import requireApiKey from '../../middleware/requireApiKey.js';
import requireAuth from '../../middleware/requireAuth.js';
import reportController from '../controllers/report.controller.js';

const router = express.Router();

router.get('/', requireAuth('read'), reportController.get);
router.get('/:id', requireAuth('read'), reportController.getById);
router.get('/by-folio-number/:folioNumber', requireAuth('read'), reportController.getByFolioNumber);
router.post('/', requireApiKey, upload.single('photo'), reportController.submit);

export default router;
