import http from 'http2';

const requireAuth = (req, res, next) => {
  if (!req.auth) {
    return res
      .status(http.constants.HTTP_STATUS_UNAUTHORIZED)
      .json({ message: "No se encontró el token de acceso" });
  }

  next();
}

export default requireAuth;
