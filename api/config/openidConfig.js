import config from './config.js'

const openidConfig = {
  issuerBaseURL: config.OPENID_ISSUER_BASE_URL,
  baseURL: config.OPENID_BASE_URL,
  clientID: config.OPENID_CLIENT_ID,
  secret: config.OPENID_CLIENT_SECRET,
};

export default openidConfig;
