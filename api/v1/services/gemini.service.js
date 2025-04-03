import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config/config.js';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: config.GEMINI_MODEL });

/**
 * Convierte un archivo a un formato compatible con Gemini.
 * @param {*} file - Archivo a convertir (generado por Multer).
 * @returns {object} Objeto con la información del archivo en formato base64 y su tipo MIME.
 */
const fileToGenerativePart = (file) => {
  return {
    inlineData: {
      data: Buffer.from(file.buffer).toString('base64'),
      mimeType: file.mimetype,
    }
  }
}

/**
 * Genera una descripción de una imagen utilizando el modelo Gemini.
 * @param {*} imageFile - Imagen a analizar (generado por Multer).
 * @returns {Promise<import('@google/generative-ai').GenerateContentResult>} Resultado de la operación.
 */
const describeImage = async (imageFile) => {
  const prompt = 'Describe the contents of this image.';
  const imageParts = [fileToGenerativePart(imageFile)];

  return await model.generateContent([prompt, ...imageParts]);
}

export default { describeImage };
