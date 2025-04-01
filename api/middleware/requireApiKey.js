import http from 'http2';
import bcrypt from 'bcryptjs';

import { Camera } from '../v1/models/camera.model.js';

 /**
  * Middleware que autentica una cámara por su ID y su llave API.
  * 
  * @example
  * import express from 'express';
  * import requireAuth from '../middleware/requireApiKey.js';
  * 
  * const router = express.Router();
  * 
  * router.get('/camera', requireApiKey, (req, res) => {
  *   res.status(200).json({ message: 'Cámara autenticada' });
  * });
  */
const requireApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const cameraId = req.headers['camera-id'];

  if (!apiKey) {
    return res.status(http.constants.HTTP_STATUS_UNAUTHORIZED).json({ message: 'Llave API requerida' });
  }

  if (!cameraId) {
    return res.status(http.constants.HTTP_STATUS_BAD_REQUEST).json({ message: 'ID de cámara requerido' });
  }

  const camera = await Camera.findById(cameraId).select({ apiKey: 1 }).exec();
  const apiKeyMatch = await bcrypt.compare(apiKey, camera.apiKey.hash);

  if (!apiKeyMatch) {
    return res.status(http.constants.HTTP_STATUS_UNAUTHORIZED).json({ message: 'Llave API inválida' });
  }

  if (camera.apiKey.expiresAt < new Date()) {
    return res.status(http.constants.HTTP_STATUS_UNAUTHORIZED).json({ message: 'Llave API expirada' });
  }

  return next();
}

export default requireApiKey;
