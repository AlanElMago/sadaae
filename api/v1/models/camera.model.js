import mongoose from 'mongoose';

const cameraApiKeySchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
  },
  rotatedAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const cameraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    requred: false,
  },
  serialNumber: {
    type: String,
    unique: true,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  apiKey: {
    type: cameraApiKeySchema,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    alias: 'ownerId',
    default: null,
  },
  establishmentId: {
    type: mongoose.Types.ObjectId,
    ref: 'Establishment',
    default: null,
  },
  activationCode: {
    type: String,
    required: true,
    immutable: true,
  },
  activatedBy: {
    type: String,
    default: null,
  },
  createdBy: {
    type: String,
    required: true,
    immutable: true,
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

export const Camera = mongoose.model('Camera', cameraSchema);
export const CameraApiKey = mongoose.model('Camera').discriminator('CameraApiKeyClass', cameraApiKeySchema);
