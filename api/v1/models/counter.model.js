import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  sequenceValue: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model('Counter', counterSchema);

/**
 * Obtiene el siguiente valor de secuencia para un campo específico.
 * @param {string} sequenceName - Nombre del campo para el cual se desea obtener el siguiente valor de secuencia.
 * @returns {Promise<number>} El siguiente valor de secuencia.
 */
const getNextSequenceValue = async (sequenceName) => {
  const counter = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true },
  );

  return counter.sequenceValue;
}

export { getNextSequenceValue };
