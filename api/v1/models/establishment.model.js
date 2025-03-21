import mongoose from 'mongoose';

const establishmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    alias: 'ownerId',
    required: true,
    immutable: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
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
  deletedBy: {
    type: String,
    default: null,
  },
},
{
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

export const Establishment = mongoose.model('Establishment', establishmentSchema);
