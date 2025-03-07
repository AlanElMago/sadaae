import config from './config.js'

const openidConfig = {
  issuerBaseURL: config.OPENID_ISSUER_BASE_URL,
  baseURL: config.OPENID_BASE_URL,
  clientID: config.OPENID_CLIENT_ID,
  clientSecret: config.OPENID_CLIENT_SECRET,
  secret: config.OPENID_SECRET,
  errorOnRequiredAuth: true,
};

export default openidConfig;
