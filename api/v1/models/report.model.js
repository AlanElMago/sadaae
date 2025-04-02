import mongoose, { mongo } from 'mongoose';

import { getNextSequenceValue } from './counter.model.js';

const photoSchema = new mongoose.Schema({
  fid: {
    type: String,
    alias: 'fileId',
    required: true,
  }
},
{
  timestamps: {
    createdAt: 'createdAt',
  },
});

const photoBurstSchema = new mongoose.Schema({
  cameraId: {
    type: mongoose.Types.ObjectId,
    ref: 'Camera',
    required: true,
  },
  photos: {
    type: [photoSchema],
    required: true,
  }
},
{
  timestamps: {
    createdAt: 'createdAt',
  },
});

const reportSchema = new mongoose.Schema({
  folioNumber: {
    type: Number,
    unique: true,
  },
  establishmentName: {
    type: String,
    required: true,
  },
  establishmentAddress: {
    type: String,
    required: true,
  },
  establishmentId: {
    type: mongoose.Types.ObjectId,
    ref: 'Establishment',
    required: true,
  },
  aiDescription: {
    type: String,
    default: 'Descripción de IA aún no disponible.',
  },
  userDescription: {
    type: String,
    alias: 'ownerDescription',
    default: 'Descripción del usuario aún no disponible.',
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  photoBurst: {
    type: photoBurstSchema,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: String,
    required: true,
  },
},
{
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

reportSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }

  try {
    this.folioNumber = await getNextSequenceValue('reportFolioNumber');
    return next();
  }
  catch (error) {
    return next(error);
  }
});

export const Report = mongoose.model('Report', reportSchema);
