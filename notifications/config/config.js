const config = {
  NOTIFICATIONS_PORT: process.env.NOTIFICATIONS_PORT || 3001,

  OIDC_AUDIENCE: process.env.OIDC_AUDIENCE || 'http://localhost:3000/api',
  OIDC_ISSUER: process.env.OIDC_ISSUER || 'http://localhost:8080/realms/sadaae',
  OIDC_JWKS_URI: process.env.OIDC_JWKS_URI || 'http://localhost:8080/realms/sadaae/protocol/openid-connect/certs',
};

export default config;
