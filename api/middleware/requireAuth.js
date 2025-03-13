import http from 'http2';

/**
 * Middleware que valida si el usuario tiene un token de acceso y si tiene los permisos necesarios (rol) para acceder a
 * un recurso. Un usuario con rol de administrador (`admin`) tiene acceso a todos los recursos del API.
 * @param {[string]} authorizedRoles - Arreglo de roles permitidos para acceder al recurso. Si el arreglo está vacío,
 * se permite el acceso a cualquier usuario con token de acceso.
 * @returns {function} Middleware de Express que valida si el usuario tiene un token de acceso y si tiene los permisos
 * necesarios (rol) para acceder a un recurso.
 */
const requireAuth = (authorizedRoles = []) => {
  return (req, res, next) => {
    if (!req.auth) {
      return res
        .status(http.constants.HTTP_STATUS_UNAUTHORIZED)
        .json({ message: "No se encontró el token de acceso" });
    }

    if (authorizedRoles.length <= 0) {
      return next();
    }

    const userRoles = req.auth.realm_access.roles;

    if (userRoles.includes('admin')) {
      return next();
    }

    if (userRoles.some(userRole => authorizedRoles.includes(userRole))) {
      return next();
    }

    return res
      .status(http.constants.HTTP_STATUS_UNAUTHORIZED)
      .json({ message: "No tienes permisos para acceder a este recurso" });
  };
};

export default requireAuth;
