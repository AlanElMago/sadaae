import http from 'http2';

import { Establishment } from '../models/establishment.model.js';
import keycloakService from '../services/keycloak.service.js';

const getEstablishments = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;
    const includeDeleted = req.query.deleted === 'true';

    const establishments = includeDeleted
      ? await Establishment.find({ userId: ownerId }).skip(offset).limit(limit).exec()
      : await Establishment.find({ userId: ownerId, deletedBy: null }).skip(offset).limit(limit).exec();

    return res.status(http.constants.HTTP_STATUS_OK).json(establishments);
  }
  catch {
    console.error('Error al obtener establecimientos', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener establecimientos' });
  }
};

const getEstablishmentById = async (req, res) => {
  try {
    const establishmentId = req.params.id;
 
    const establishment = await Establishment.findById(establishmentId).exec();

    if (!establishment) {
      return res
        .status(http.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: 'No se encontró el establecimiento' });
    }

    return res.status(http.constants.HTTP_STATUS_OK).json(establishment);
  }
  catch (error) {
    console.error('Error al obtener establecimiento', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de establecimiento inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener establecimiento' });
  }
};

const createEstablishment = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const userId = req.auth.sub;

    const establishment = new Establishment({
      ...req.body,
      userId: ownerId,
      createdBy: userId,
      updatedBy: userId,
    });

    const validationErrors = establishment.validateSync();
    if (validationErrors) {
      return res.status(http.constants.HTTP_STATUS_BAD_REQUEST).json({ message: validationErrors });
    }

    await establishment.save();
    await keycloakService.registerEstablishment(req.originalUrl, establishment.id, ownerId, req.headers.authorization);

    return res
      .status(http.constants.HTTP_STATUS_OK)
      .json({ message: 'Establecimiento creado existosamente', data: establishment });
  }
  catch (error) {
    console.error('Error al crear establecimiento', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al crear establecimiento' });
  }
};

const updateEstablishment = async (req, res) => {
  try {
    const establishmentId = req.params.id;
    const userId = req.auth.sub;

    const establishment = await Establishment.findById(establishmentId).exec();

    if (!establishment) {
      return res
        .status(http.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: 'No se encontró el establecimiento' });
    }

    Object.assign(establishment, { ...req.body, updatedBy: userId });

    const validationErrors = establishment.validateSync();
    if (validationErrors) {
      return res.status(http.constants.HTTP_STATUS_BAD_REQUEST).json({ message: validationErrors });
    }

    await establishment.save();

    return res
      .status(http.constants.HTTP_STATUS_OK)
      .json({ message: 'Establecimiento actualizado existosamente', data: establishment });
  }
  catch (error) {
    console.error('Error al actualizar establecimiento', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de establecimiento inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al actualizar establecimiento' });
  }
};

const deleteEstablishment = async (req, res) => {
  try {
    const establishmentId = req.params.id;
    const userId = req.auth.sub;

    const establishment = await Establishment.findById(establishmentId).exec();

    if (!establishment || establishment.deletedBy !== null) {
      return res
        .status(http.constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: 'No se encontró el establecimiento' });
    }

    establishment.deletedBy = userId;

    await establishment.save();

    return res.status(http.constants.HTTP_STATUS_NO_CONTENT).send();
  }
  catch (error) {
    console.error('Error al eliminar establecimiento', error);

    if (error.kind === 'ObjectId') {
      return res
        .status(http.constants.HTTP_STATUS_BAD_REQUEST)
        .json({ message: 'ID de establecimiento inválido' });
    }

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al eliminar establecimiento' });
  }
};

export default {
  get: getEstablishments,
  getById: getEstablishmentById,
  create: createEstablishment,
  update: updateEstablishment,
  delete: deleteEstablishment,
};
