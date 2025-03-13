import { JwksClient } from 'jwks-rsa';

import config from '../config/config.js';
import { expressjwt } from 'express-jwt';

const jwksClient = new JwksClient({ jwksUri: config.OIDC_JWKS_URI });

const getVerificationKey = async (req, token) => {
  const keyId = token.payload.kid;
  const key = await jwksClient.getSigningKey(keyId);

  return key.getPublicKey();
}

const validateJwt = expressjwt({
  secret: getVerificationKey,
  algorithms: ['RS256'],
  issuer: config.OIDC_ISSUER,
  audience: config.OIDC_AUDIENCE,
  credentialsRequired: false,
  complete: true,
})

export default validateJwt;
