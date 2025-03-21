import http from 'http2';

import { Establishment } from '../models/establishment.model.js';

const getEstablishments = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;
    const includeDeleted = req.query.deleted === 'true';

    const establishments = includeDeleted
      ? await Establishment.find().skip(offset).limit(limit).exec()
      : await Establishment.find({ deletedBy: null }).skip(offset).limit(limit).exec();

    return res.status(http.constants.HTTP_STATUS_OK).json(establishments);
  }
  catch {
    console.error('Error al obtener establecimientos', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener establecimientos' });
  }
}

const getEstablishmentById = async (req, res) => {
  try {
    const establishmentId = req.params.id;

    const establishment = await Establishment.findById(establishmentId).exec();

    return res.status(http.constants.HTTP_STATUS_OK).json(establishment);
  }
  catch (error) {
    console.error('Error al obtener establecimiento', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener establecimiento' });
  }
};

const getEstablishmentsByUserId = async(req, res) => {
  try {
    const userId = req.params.id;
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;
    const includeDeleted = req.query.deleted === 'true';

    const establishments = includeDeleted
      ? await Establishment.find({ userId: userId }).skip(offset).limit(limit).exec()
      : await Establishment.find({ userId: userId, deletedBy: null }).skip(offset).limit(limit).exec();

    return res.status(http.constants.HTTP_STATUS_OK).json(establishments);
  }
  catch {
    console.error('Error al obtener establecimientos', error);

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al obtener establecimientos' });
  }
}

const createEstablishment = async (req, res) => {
  try {
    const userId = req.auth.sub;

    const establishment = new Establishment({
      ...req.body,
      userId: userId,
      createdBy: userId,
      updatedBy: userId,
    });

    const validationErrors = establishment.validateSync();
    if (validationErrors) {
      return res.status(http.constants.HTTP_STATUS_BAD_REQUEST).json({ message: validationErrors });
    }

    await establishment.save();

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
}

const updateEstablishment = async (req, res) => {
  try {
    const establishmentId = req.params.id;
    const userId = req.auth.sub;

    const establishment = await Establishment.findById(establishmentId).exec();

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

    return res
      .status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ message: 'Error al actualizar establecimiento' });
  }
}

const deleteEstablishment = async (req, res) => {
  try {
    const establishmentId = req.params.id;
    const userId = req.auth.sub;

    const establishment = await Establishment.findById(establishmentId).exec();

    establishment.deletedBy = userId;

    await establishment.save();

    return res.status(http.constants.HTTP_STATUS_NO_CONTENT)
  }
  catch (error) {
    console.error('Error al eliminar establecimiento', error);

    return res.status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
  }
}

export default {
  get: getEstablishments,
  getById: getEstablishmentById,
  getByUserId: getEstablishmentsByUserId,
  create: createEstablishment,
  update: updateEstablishment,
  delete: deleteEstablishment
};
