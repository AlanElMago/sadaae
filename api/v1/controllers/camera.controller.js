import http from 'http2';

import { Camera } from '../models/camera.model.js';
import cameraService from '../services/camera.service.js';
import mongoose from 'mongoose';

const getCameras = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;

    const cameras = await Camera.find().skip(offset).limit(limit).exec();

    return res.status(http.constants.HTTP_STATUS_OK).json(cameras);
  }
  catch (error) {
    console.log('Error al obtener cámaras', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener cámaras' });
  }
};

const getCameraById = async (req, res) => {
  try {
    const cameraId = req.params.id;

    const camera = await Camera.findById(cameraId).exec();

    if (!camera) {
      return res
        .status(http.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: 'No se encontró la cámara' });
    }

    return res.status(http.constants.HTTP_STATUS_OK).json(camera);
  }
  catch (error) {
    console.log('Error al obtener cámara', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de la cámara es inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener cámara' });
  }
};

const getCamerasByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;

    const cameras = await Camera.find({ userId: userId }).skip(offset).limit(limit).exec();

    return res.status(http.constants.HTTP_STATUS_OK).json(cameras);
  }
  catch (error) {
    console.log('Error al obtener cámaras', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de la cámara es inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener cámaras' });
  }
};

const getCamerasByEstablishmentId = async (req, res) => {
  try {
    const establishmentId = mongoose.Types.ObjectId.createFromHexString(req.params.id);
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;

    const cameras = await Camera.find({ establishmentId: establishmentId }).skip(offset).limit(limit).exec();

    return res.status(http.constants.HTTP_STATUS_OK).json(cameras);
  }
  catch (error) {
    console.log('Error al obtener cámaras', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de establecimiento inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener cámaras' });
  }
};

const createCamera = async (req, res) => {
  try {
    const userId = req.auth.sub;
    const cameraApiKeyResult = await cameraService.generateApiKey(60 * 24 * 60 * 60 * 1000); // 60 días

    const camera = new Camera({
      name: req.body.name,
      description: req.body.description,
      serialNumber: req.body.serialNumber,
      model: req.body.model,
      apiKey: cameraApiKeyResult.cameraApiKey,
      activationCode: cameraService.generateActivationCode(),
      createdBy: userId,
      updatedBy: userId,
    });

    const validationErrors = camera.validateSync();
    if (validationErrors) {
      return res.status(http.constants.HTTP_STATUS_BAD_REQUEST).json({ message: validationErrors });
    }

    await camera.save();

    return res.status(http.constants.HTTP_STATUS_CREATED).json({
      message: 'Cámara creada exitosamente',
      data: {
        apiKey: cameraApiKeyResult.unhashedApiKey,
        camera: camera,
      },
    });
  }
  catch (error) {
    console.log('Error al crear cámara', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al crear cámara' });
  }
};

const updateCamera = async (req, res) => {
  try {
    const userId = req.auth.sub;
    const cameraId = req.params.id;

    const camera = await Camera.findById(cameraId).exec();

    if (!camera) {
      return res
        .status(http.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: 'No se encontró la cámara' });
    }

    camera.name = req.body.name || camera.name;
    camera.description = req.body.description || camera.description;
    camera.enabled = req.body.enabled || camera.enabled;
    camera.updatedBy = userId;

    await camera.save();

    const validationErrors = camera.validateSync();
    if (validationErrors) {
      return res.status(http.constants.HTTP_STATUS_BAD_REQUEST).json({ message: validationErrors });
    }

    return res
      .status(http.constants.HTTP_STATUS_OK)
      .json({ message: 'Cámara actualizada exitosamente', data: camera });
  }
  catch (error) {
    console.log('Error al actualizar cámara', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de establecimiento inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al actualizar cámara' });
  }
};

export default {
  get: getCameras,
  getById: getCameraById,
  getByUserId: getCamerasByUserId,
  getByEstablishmentId: getCamerasByEstablishmentId,
  create: createCamera,
  update: updateCamera,
};
