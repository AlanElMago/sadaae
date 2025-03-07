const config = {
  API_PORT: process.env.API_PORT || 3000,

  OPENID_ISSUER_BASE_URL: process.env.OPENID_ISSUER_BASE_URL || 'http://localhost:8080/realms/sadaae',
  OPENID_BASE_URL: process.env.OPENID_BASE_URL || 'http://localhost',
  OPENID_CLIENT_ID: process.env.OPENID_CLIENT_ID || 'sadaae-api',
  OPENID_CLIENT_SECRET: process.env.OPENID_CLIENT_SECRET || 'my-client-secret',
  OPENID_SECRET: process.env.OPENID_SECRET || 'my-secret',
};

export default config;
