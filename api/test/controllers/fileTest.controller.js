import http from 'http2';

import seaweedfsService from '../../v1/services/seaweedfs.service.js';

const uploadImage = async (req, res) => {
  try {
    const mimetype = req.file.mimetype;

    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res
        .status(http.constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE)
        .json({ message: 'Formato de imagen no soportado. Solo se permiten JPEG y PNG' });
    }

    const fid = await seaweedfsService.generateFid();
    const response = await seaweedfsService.uploadFile(fid, req.file);

    return res.status(http.constants.HTTP_STATUS_CREATED).json({ ...response.data, fid: fid });
  }
  catch (error) {
    console.error('Error al subir imagen', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al subir imagen' });
  }
}

const downloadImage = async (req, res) => {
  try {
    const fid = req.params.fid;

    const downloadFileResponse = await seaweedfsService.downloadFile(fid);

    res.setHeader('Content-Type', downloadFileResponse.headers['content-type']);
    downloadFileResponse.data.pipe(res);
  }
  catch (error) {
    console.error('Error al descargar imagen', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al descargar imagen' });
  }
}

export default { uploadImage, downloadImage };
