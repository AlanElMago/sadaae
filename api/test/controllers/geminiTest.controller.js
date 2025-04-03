import http from 'http2';

import config from '../../config/config.js';
import geminiService from '../../v1/services/gemini.service.js';

const describeImage = async (req, res) => {
  try {
    if (!config.GEMINI_API_KEY) {
      return res
        .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .json({ message: 'Llave API de Gemini no configurada' });
    }

    const imageDescriptionResponse = await geminiService.describeImage(req.file);

    return res
      .status(http.constants.HTTP_STATUS_OK)
      .json({ message: 'Descripción de imagen generada exitosamente', data: imageDescriptionResponse });
  }
  catch (error) {
    console.error('Error al generar descripción de la imagen', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al generar descripción de la imagen' });
  }
}

export default { describeImage };
