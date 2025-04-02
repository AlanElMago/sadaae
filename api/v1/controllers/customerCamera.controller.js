import http from 'http2';

import { Camera } from '../models/camera.model.js';
import keycloakService from '../services/keycloak.service.js';
import { Establishment } from '../models/establishment.model.js';

const getCameras = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;

    const cameras = await Camera.find({ userId: ownerId }).skip(offset).limit(limit).exec();
    
    return res.status(http.constants.HTTP_STATUS_OK).json(cameras);
  }
  catch (error) {
    console.error('Error al obtener cámaras', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener cámaras' });
  }
};

const getCameraById = async (req, res) => {
  try {
    const cameraId = req.params.id;

    const camera = await Camera.findById(cameraId).exec();

    return res.status(http.constants.HTTP_STATUS_OK).json(camera);
  }
  catch (error) {
    console.error('Error al obtener cámara', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de cámara inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener cámara' });
  }
};

const activateCamera = async (req, res) => {
  try {
    const ownerId = req.auth.sub;
    const serialNumber = req.body.serialNumber;
    const activationCode = req.body.activationCode;

    const camera = await Camera.findOne({ serialNumber: serialNumber });

    if (!camera) {
      return res
        .status(http.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: 'No se encontró la cámara' });
    }

    if (camera.activatedBy) {
      return res
        .status(http.constants.HTTP_STATUS_FORBIDDEN)
        .json({ message: 'La cámara ya ha sido activada' });
    }

    if (activationCode !== camera.activationCode) {
      return res
        .status(http.constants.HTTP_STATUS_UNAUTHORIZED)
        .json({ message: 'Código de activación inválido' });
    }

    camera.activatedBy = ownerId;
    camera.enabled = true;
    camera.userId = ownerId;
    camera.updatedBy = ownerId;

    await camera.save();
    await keycloakService.registerCamera(req.originalUrl, camera.id, ownerId, req.headers.authorization);

    return res
      .status(http.constants.HTTP_STATUS_OK)
      .json({ message: 'Cámara activada exitosamente', data: camera });
  }
  catch (error) {
    console.error('Error al activar cámara', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de cámara inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al activar cámara' });
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

    const validationErrors = camera.validateSync();
    if (validationErrors) {
      return res.status(http.constants.HTTP_STATUS_BAD_REQUEST).json({ message: validationErrors });
    }

    await camera.save();

    return res
      .status(http.constants.HTTP_STATUS_OK)
      .json({ message: 'Cámara actualizada exitosamente', data: camera });
  }
  catch (error) {
    console.error('Error al actualizar cámara', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de cámara inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al actualizar cámara' });
  }
};

const assignCameraToEstablishment = async (req, res) => {
  try {
    const userId = req.auth.sub;
    const cameraId = req.params.id;
    const establishmentId = req.body.establishmentId;

    const camera = await Camera.findById(cameraId).exec();

    if (!camera) {
      return res
        .status(http.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: 'No se encontró la cámara' });
    }

    const establishment = await Establishment.findById(establishmentId).exec();

    if (!establishment) {
      return res
        .status(http.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: 'No se encontró el establecimiento' });
    }

    if (establishment.userId !== userId) {
      return res
        .status(http.constants.HTTP_STATUS_FORBIDDEN)
        .json({ message: 'No tienes permiso para asignar esta cámara a este establecimiento' });
    }

    camera.establishmentId = establishmentId;
    camera.updatedBy = userId;

    await camera.save();

    return res
      .status(http.constants.HTTP_STATUS_OK)
      .json({ message: 'Cámara asignada exitosamente', data: camera });
  }
  catch (error) {
    console.error('Error al asignar cámara a establecimiento', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de cámara inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al asignar cámara a establecimiento' });
  }
}

export default {
  get: getCameras,
  getById: getCameraById,
  activate: activateCamera,
  update: updateCamera,
  assignEstablishment: assignCameraToEstablishment,
};
