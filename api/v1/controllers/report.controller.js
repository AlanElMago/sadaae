import http from 'http2';

import { Camera } from '../models/camera.model.js';
import { Establishment } from '../models/establishment.model.js';
import { Report } from '../models/report.model.js';
import seaweedfsService from '../services/seaweedfs.service.js';

const submitReport = async (req, res) => {
  try {
    const cameraId = req.headers['camera-id'];
    const latitude = new Number(req.body.latitude);
    const longitude = new Number(req.body.longitude);

    const photoFid = await seaweedfsService.generateFid();
    await seaweedfsService.uploadFile(photoFid, req.file);

    const camera = await Camera.findById(cameraId).select({ userId: 1, establishmentId: 1 }).exec();
    const establishment = await Establishment.findById(camera.establishmentId).select({ name: 1, address: 1 }).exec();

    const report = new Report({
      establishmentName: establishment.name,
      establishmentAddress: establishment.address,
      establishmentId: camera.establishmentId,
      latitude: latitude,
      longitude: longitude,
      photoBurst: { cameraId: cameraId, photos: [{ fid: photoFid }] },
      createdBy: camera.userId,
      updatedBy: camera.userId,
    });

    const validationErrors = report.validateSync();
    if (validationErrors) {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: validationErrors });
    }

    await report.save();

    return res
      .status(http.constants.HTTP_STATUS_CREATED)
      .json({ message: 'Reporte creado exitosamente', data: report });
  }
  catch (error) {
    console.error('Error al crear reporte', error);

    if (error.type === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de establecimiento inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al crear reporte' });
  }
};

export default {
  submit: submitReport,
};
