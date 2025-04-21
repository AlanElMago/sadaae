import jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

import config from '../config/config.js';

const jwksClient = new JwksClient({ jwksUri: config.OIDC_JWKS_URI });

const getVerificationKey = async (header, callback) => {
  try {
    const key = await jwksClient.getSigningKey(header.kid);
    const publicKey = key.getPublicKey();

    callback(null, publicKey);
  }
  catch (error) {
    callback(error);
  }
}

const validateJwt = (token, callback) => {
  jwt.verify(token, getVerificationKey, {
    algorithms: ['RS256'],
    issuer: config.OIDC_ISSUER,
    audience: config.OIDC_AUDIENCE,
    complete: true,
  }, callback);
}

export default validateJwt;
