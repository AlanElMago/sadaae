import http from 'http2';

import seaweedfsService from '../services/seaweedfs.service.js';

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
};

export default {
  download: downloadImage,
};
