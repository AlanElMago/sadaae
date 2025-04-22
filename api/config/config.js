const config = {
  API_PORT: process.env.API_PORT || 3000,
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',

  KC_REALM_URL: process.env.KC_REALM_URL || 'http://localhost:8080/realms/sadaae',
  KC_CLIENT_ID: process.env.KC_CLIENT_ID || 'sadaae-api',
  KC_CLIENT_SECRET: process.env.KC_CLIENT_SECRET || 'my-client-secret',

  OIDC_AUDIENCE: process.env.OIDC_AUDIENCE || 'http://localhost:3000/api',
  OIDC_ISSUER: process.env.OIDC_ISSUER || 'http://localhost:8080/realms/sadaae',
  OIDC_JWKS_URI: process.env.OIDC_JWKS_URI || 'http://localhost:8080/realms/sadaae/protocol/openid-connect/certs',
  OIDC_TOKEN_URI: process.env.OIDC_TOKEN_URI || 'http://localhost:8080/realms/sadaae/protocol/openid-connect/token',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  MONGO_USER: process.env.MONGO_USER || 'mongo',
  MONGO_PASS: process.env.MONGO_PASS || 'mongo12345',
  MONGO_DB: process.env.MONGO_DB || 'sadaae',

  SEAWEEDFS_MASTER_URL: process.env.SEAWEEDFS_MASTER_URL || 'http://localhost:8081',
  SEAWEEDFS_VOLUME_URL: process.env.SEAWEEDFS_VOLUME_URL || 'http://localhost:8082',

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash',

  NOTIFICATIONS_SERVER_URL: process.env.NOTIFICATIONS_SERVER_URL || 'http://localhost:3001',
};

export default config;
