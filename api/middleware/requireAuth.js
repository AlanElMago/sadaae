import axios from 'axios';
import http from 'http2';

import config from '../config/config.js';

/**
 * Middleware que valida si el usuario tiene un token de acceso y si tiene los permisos necesarios para acceder a un
 * recurso.
 * @param {string} scope - Alcance que se requiere para acceder al recurso (e.j. `'create'` `'read'`, `'update'`,
 * `'delete'`). Si no se especifica, implica que el recurso no requiere de un alcance en específico.
 * @returns {function} Middleware de Express que valida si el usuario tiene un token de acceso y si tiene los permisos
 * necesarios para acceder a un recurso.
 * 
 * @example
 * import express from 'express';
 * import requireAuth from '../middleware/requireAuth.js';
 * 
 * const router = express.Router();
 * 
 * router.get('/user/:id', requireAuth('read'), (req, res) => {
 *   res.status(200).json({ message: 'Usuario encontrado' });
 * }
 * 
 * router.get('/protected', requireAuth(), (req, res) => {
 *   res.status(200).json({ message: 'Recurso protegido' });
 * })
 */
const requireAuth = (scope = "") => {
  return async (req, res, next) => {
    if (!req.auth) {
      return res
        .status(http.constants.HTTP_STATUS_UNAUTHORIZED)
        .json({ message: "No se encontró el token de acceso" });
    }

    const formData = new FormData();
    const permissionUri = req.originalUrl.replace('/api', '');

    formData.append('grant_type', 'urn:ietf:params:oauth:grant-type:uma-ticket');
    formData.append('response_mode', 'decision');
    formData.append('audience', 'sadaae-api');
    formData.append('permission', `${permissionUri}#${scope}`);
    formData.append('permission_resource_format', 'uri');
    formData.append('permission_resource_matching_uri', 'true');

    try {
      const authResponse = await axios({
        method: 'post',
        url: config.OIDC_TOKEN_URI,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': req.headers.authorization,
        },
        validateStatus: (status) => (status >= 200 && status < 500),
      });

      if (authResponse.data.result === true) {
        return next();
      }

      return res.status(authResponse.status).json(authResponse.data);
    }
    catch (error) {
      console.log(error);

      return res.status(http.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: error });
    }
  }
};

export default requireAuth;
