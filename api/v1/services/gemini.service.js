import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

import config from '../../config/config.js';
import { Report } from '../models/report.model.js';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: config.GEMINI_MODEL,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

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

/**
 * Agrega una descripción generada por IA a un reporte a partir de una imagen.
 * @param {string} reportId - ID del reporte al que se le agregará la descripción.
 * @param {*} imageFile - Imagen a analizar (generado por Multer).
 * @returns {Promise<import('mongoose').Document>} Reporte actualizado.
 */
const appendAiDescriptionToReport = async (reportId, imageFile) => {
  let aiDescription = '';

  try {
    const prompt = 'Eres un asistente de IA para operadores y despachadores del 911. ' +
      'Analiza esta imagen y proporciona una descripción concisa y objetiva de lo que parece estar sucediendo. ' +
      'Comienza con la información de emergencia más crítica: armas visibles, lesiones aparentes, número de personas involucradas y amenazas inmediatas. ' +
      'Luego, describe la escena, los detalles de la ubicación y cualquier característica distintiva que ayude a los socorristas a identificar a los sujetos. ' +
      'Si la situación parece implicar un delito, indica el escenario más probable (asalto, robo, extorsión, etc.). ' +
      'Evita la especulación, pero ten en cuenta cualquier ambigüedad. ' +
      'Formatea tu respuesta como un solo párrafo estructurado que un despachador pueda transmitir rápidamente a los oficiales que acudan. ' +
      'Incluye solo lo que se pueda observar directamente en la imagen.';

    const imageParts = [fileToGenerativePart(imageFile)];

    const generateContentResult = await model.generateContent([prompt, ...imageParts]);

    aiDescription = generateContentResult.response.text();
  }
  catch (error) {
    console.error('Error al generar descripción de IA', error);

    aiDescription = 'Error al generar descripción de IA.';
  }
  finally {
    const report = await Report.findOneAndUpdate(
      { _id: reportId },
      { $set: { aiDescription: aiDescription } },
      { new: true, upsert: false },
    );
    console.log(`[${new Date().toISOString()}] Descripción IA generada: ${report.id}`);

    return report;
  }
}

export default { describeImage, appendAiDescriptionToReport };
