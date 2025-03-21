import config from './config.js';

/**
 * @type { import('mongoose').ConnectOptions }
 */
const mongooseConnectOptions = {
  user: config.MONGO_USER,
  pass: config.MONGO_PASS,
  dbName: config.MONGO_DB,
}

export default mongooseConnectOptions;
