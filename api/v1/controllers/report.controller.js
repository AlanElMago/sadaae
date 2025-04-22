import http from 'http2';

import config from '../../config/config.js';
import { Camera } from '../models/camera.model.js';
import { Establishment } from '../models/establishment.model.js';
import { Report } from '../models/report.model.js';
import seaweedfsService from '../services/seaweedfs.service.js';
import geminiService from '../services/gemini.service.js';
import notificationService from '../services/notification.service.js';

const getReports = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;

    const reports = await Report.find().skip(offset).limit(limit).exec();

    return res.status(http.constants.HTTP_STATUS_OK).json(reports);
  }
  catch (error) {
    console.error('Error al obtener reportes', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener reportes' });
  }
};

const getReportById = async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await Report.findById(reportId).exec();

    if (!report) {
      return res
        .status(http.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: 'Reporte no encontrado' });
    }

    return res.status(http.constants.HTTP_STATUS_OK).json(report);
  }
  catch (error) {
    console.error('Error al obtener reporte', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de reporte inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener reporte' });
  }
};

const getReportByFolioNumber = async (req, res) => {
  try {
    const folioNumber = req.params.folioNumber;

    const report = await Report.findOne({ folioNumber: folioNumber }).exec();

    if (!report) {
      return res
        .status(http.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: 'Reporte no encontrado' });
    }

    return res.status(http.constants.HTTP_STATUS_OK).json(report);
  }
  catch (error) {
    console.error('Error al obtener reporte', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener reporte' });
  }
};

const submitReport = async (req, res) => {
  try {
    const cameraId = req.headers['camera-id'];
    const latitude = new Number(req.body.latitude);
    const longitude = new Number(req.body.longitude);

    const photoFid = await seaweedfsService.generateFid();
    await seaweedfsService.uploadFile(photoFid, req.file);

    const camera = await Camera.findById(cameraId).select({ userId: 1, establishmentId: 1 }).exec();
    const establishment = await Establishment.findById(camera.establishmentId).select({ name: 1, address: 1 }).exec();

    const aiDescription = config.GEMINI_API_KEY
      ? 'Descripción de IA aún no disponible.'
      : 'Descripción de IA no disponible por falta de configuración.';

    const report = new Report({
      establishmentName: establishment.name,
      establishmentAddress: establishment.address,
      establishmentId: camera.establishmentId,
      aiDescription: aiDescription,
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

    notificationService.sendNotificationAlert(report.id);

    if (config.GEMINI_API_KEY) {
      geminiService.appendAiDescriptionToReport(report.id, req.file);
    }

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

const appendPhotoToReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await Report.exists({ _id: reportId }).exec();

    if (!report) {
      return res
        .status(http.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: 'Reporte no encontrado' });
    }

    const photoFid = await seaweedfsService.generateFid();
    const uploadFileResponse = await seaweedfsService.uploadFile(photoFid, req.file);

    await Report.findOneAndUpdate(
      { _id: reportId },
      { $addToSet: { "photoBurst.photos": { fid: photoFid } } },
      { upsert: false },
    );

    return res
      .status(http.constants.HTTP_STATUS_CREATED)
      .json({ message: 'Foto anexada exitosamente', data: uploadFileResponse.data });
  }
  catch (error) {
    console.error('Error al anexar foto al reporte', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al anexar foto al reporte' });
  }
};

export default {
  get: getReports,
  getById: getReportById,
  getByFolioNumber: getReportByFolioNumber,
  submit: submitReport,
  appendPhoto: appendPhotoToReport,
};
