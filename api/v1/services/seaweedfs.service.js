import axios from 'axios';

import config from '../../config/config.js';

/**
 * Genera un nuevo FID (File ID) para subir un archivo a SeaweedFS.
 * @returns {Promise<string>} FID generado.
 */
const generateFid = async () => {
  try {
    const response = await axios.get(`${config.SEAWEEDFS_MASTER_URL}/dir/assign`);

    return response.data.fid;
  }
  catch (error) {
    console.error('Error al generar FID', error);

    throw error;
  }
}

/**
 * Sube un archivo a SeaweedFS.
 * @param {string} fid - ID del archivo.
 * @param {*} file - Archivo a subir (generado por Multer).
 * @returns {Promise<import('axios').AxiosResponse>} Resultado de la operación.
 */
const uploadFile = async (fid, file) => {
  try {
    const formData = new FormData();

    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append('file', blob, file.originalname);

    return await axios({
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
      url: `${config.SEAWEEDFS_VOLUME_URL}/${fid}`,
      data: formData,
    });
  }
  catch (error) {
    console.error('Error al subir archivo', error);

    throw error;
  }
}

/**
 * Descarga un archivo de SeaweedFS.
 * @param {string} fid - ID del archivo.
 * @returns {Promise<import('axios').AxiosResponse>} Resultado de la operación.
 */
const downloadFile = async (fid) => {
  try {
    return await axios.get(`${config.SEAWEEDFS_VOLUME_URL}/${fid}`, { responseType: 'stream' });
  }
  catch (error) {
    console.error('Error al descargar archivo', error);

    throw error;
  }
}

export default { generateFid, uploadFile, downloadFile };
