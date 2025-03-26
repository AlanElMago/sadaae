import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

import { CameraApiKey } from '../models/camera.model.js';

/**
 * @typedef {Object} CameraApiKeyResult
 * @property {string} unhashedApiKey - Llave API sin aplicar el hash
 * @property {import('../models/camera.model.js').CameraApiKey} cameraApiKey - Objeto que continene la llave API de la
 * cámara con el hash aplicado, la fecha de rotación y la fecha de expiración
 */

/**
 * Genera una llave API aleatoria para una cámara
 * @param {number} expiresIn - Tiempo de expiración de la llave en milisegundos
 * @param {number} numberOfBytes - Número de bytes para la llave
 * @returns {Promise<CameraApiKeyResult>} Promesa con el resultado de la operación
 */
const generateApiKey = async (expiresIn, numberOfBytes = 24) => {
  const apiKey = crypto.randomBytes(numberOfBytes).toString('base64url');
  const hashedApiKey = await bcrypt.hash(apiKey, 10);

  const cameraApiKey = new CameraApiKey({
    hash: hashedApiKey,
    rotatedAt: new Date(),
    expiresAt: new Date(Date.now() + expiresIn),
  });

  const result = {
    unhashedApiKey: apiKey,
    cameraApiKey: cameraApiKey,
  };

  return result;
};

/**
 * Genera un código de activación de 20 caracteres para una cámara
 * @returns {string} Código de activación generado
 */
const generateActivationCode = () => {
  const size = 20;
  const activationCodeCharacterSet = 'abcdefghjkmnpqrstuwxyz0123456789';

  let result = '';
  for (let i = 0; i < size; i++) {
    const randomIndex = crypto.randomInt(0, activationCodeCharacterSet.length);
    result += activationCodeCharacterSet[randomIndex];
  }

  return result;
}

export default {
  generateApiKey,
  generateActivationCode,
};
