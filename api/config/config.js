const config = {
  API_PORT: process.env.API_PORT || 3000,

  OIDC_AUDIENCE: process.env.OIDC_AUDIENCE || 'http://localhost:3000/api',
  OIDC_ISSUER: process.env.OIDC_ISSUER || 'http://localhost:8080/realms/sadaae',
  OIDC_JWKS_URI: process.env.OIDC_JWKS_URI || 'http://localhost:8080/realms/sadaae/protocol/openid-connect/certs',
  OIDC_TOKEN_URI: process.env.OIDC_TOKEN_URI || 'http://localhost:8080/realms/sadaae/protocol/openid-connect/token',
};

export default config;
