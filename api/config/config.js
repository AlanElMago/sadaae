const config = {
  API_PORT: process.env.API_PORT || 3000,
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',

  OIDC_AUDIENCE: process.env.OIDC_AUDIENCE || 'http://localhost:3000/api',
  OIDC_ISSUER: process.env.OIDC_ISSUER || 'http://localhost:8080/realms/sadaae',
  OIDC_JWKS_URI: process.env.OIDC_JWKS_URI || 'http://localhost:8080/realms/sadaae/protocol/openid-connect/certs',
  OIDC_TOKEN_URI: process.env.OIDC_TOKEN_URI || 'http://localhost:8080/realms/sadaae/protocol/openid-connect/token',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  MONGO_USER: process.env.MONGO_USER || 'mongo',
  MONGO_PASS: process.env.MONGO_PASS || 'mongo12345',
  MONGO_DB: process.env.MONGO_DB || 'sadaae',
};

export default config;
