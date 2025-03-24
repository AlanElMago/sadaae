import axios from 'axios';
import http from 'http2';

/**
 * Instancia del cliente de Keycloak
 * @type {KeycloakClient}
 */
let keycloakClientInstance = null;

/**
 * Clase que representa un cliente de Keycloak
 */
class KeycloakClient {
  /**
   * Constructor de la clase
   * @param {string} baseUrl - URL base de Keycloak
   * @param {string} clientId - ID del cliente
   * @param {string} clientSecret - Secreto del cliente
   */
  constructor (baseUrl, clientId, clientSecret) {
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /**
   * Inicializa el cliente de Keycloak
   */
  init = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/protocol/openid-connect/token`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
      });

      this.token = response.data;
    }
    catch (error) {
      console.error('Error al inicializar el cliente de Keycloak', error);
    }
  };

  /**
   * Refresca el token de acceso y llama a una función callback después de hacerlo
   * @param {Function} callback - Función a llamar después de refrescar el token 
   * @returns {Promise<any>} Promesa con el resultado de la función callback
   */
  refreshToken = async (callback) => {
    try {
      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/protocol/openid-connect/token`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
      });

      this.token = response.data;

      return callback();
    }
    catch (error) {
      console.error('Error al refrescar token', error);
    }
  };
}

/**
 * @typedef UmaResourceOptions Opciones para crear un recurso UMA
 * @property {string} displayName - Nombre amigable del recurso
 * @property {string} type - Tipo del recurso
 * @property {string} owner - ID o correo del propietario del recurso
 * @property {boolean} ownerManagedAccess - Indica si el propietario administra el acceso al recurso
 * @property {string[]} uris - URIs del recurso
 * @property {string[]} resource_scopes - Alcances del recurso (e.j. `create`, `read`, `update`, `delete`)
 */

/**
 * Crea un recurso UMA dentro de una estancia de Keycloak
 * @param {string} name - Nombre del recurso
 * @param {UmaResourceOptions} options - Opciones adicionales para crear el recurso
 * @returns {Promise<import('axios').AxiosResponse>} Promesa con el resultado de la operación
 */
const createUmaResource = async (name, options) => {
  if (!keycloakClientInstance) {
    throw new Error('Keycloak client not connected');
  }

  const requestBody = options;
  requestBody.name = name;

  try {
    const response = await axios({
      method: 'post',
      url: `${keycloakClientInstance.baseUrl}/authz/protection/resource_set`,
      headers: {
        'Authorization': `${keycloakClientInstance.token.token_type} ${keycloakClientInstance.token.access_token}`,
        'Content-Type': 'application/json',
      },
      data: requestBody,
      validateStatus: (status) => (status >= 200 && status < 300) || status === http.constants.HTTP_STATUS_FORBIDDEN,
    });

    if (response.status === http.constants.HTTP_STATUS_FORBIDDEN && response.data.error === 'invalid_bearer_token') {
      return await keycloakClientInstance.refreshToken(() => createUmaResource(name, options));
    }

    return response;
  }
  catch (error) {
    console.error('Error al crear recurso UMA', error);
  }
};

/**
 * @typedef ResourcePermissionOptions Opciones para crear un permiso para un recurso
 * @property {string} description - Descripción del permiso
 * @property {string[]} scopes - Alcances del permiso (e.j. `create`, `read`, `update`, `delete`)
 * @property {string[]} users - Usuarios a los que se les otorga el permiso
 */

/**
 * Crea un permiso para un recurso en una instancia de Keycloak
 * @param {string} name - Nombre del permiso
 * @param {string} resourceId - ID del recurso
 * @param {string} ownerBearerToken - Token de acceso del propietario del recurso
 * @param {ResourcePermissionOptions} options - Opciones adicionales para crear el permiso
 * @returns {Promise<import('axios').AxiosResponse>} Promesa con el resultado de la operación
 */
const createResourcePermission = async (name, resourceId, ownerBearerToken, options) => {
  if (!keycloakClientInstance) {
    throw new Error('Keycloak client not connected');
  }

  const requestBody = options;
  requestBody.name = name;

  try {
    const response = await axios({
      method: 'post',
      url: `${keycloakClientInstance.baseUrl}/authz/protection/uma-policy/${resourceId}`,
      headers: {
        'Authorization': `${ownerBearerToken}`,
        'Content-Type': 'application/json',
      },
      data: requestBody,
      validateStatus: (status) => (status >= 200 && status < 300) || status === http.constants.HTTP_STATUS_FORBIDDEN,
    });

    if (response.status === http.constants.HTTP_STATUS_FORBIDDEN && response.data.error === 'invalid_bearer_token') {
      return await keycloakClientInstance.refreshToken(() => createResourcePermission(name, resourceId, options));
    }

    return response;
  }
  catch (error) {
    console.error('Error al crear permiso para un recurso', error);
  }
};

/**
 * Conecta el cliente de Keycloak a una instancia de Keycloak
 * @param {*} baseUrl - URL base de Keycloak
 * @param {*} clientId - ID del cliente
 * @param {*} clientSecret - Secreto del cliente
 * @param {*} callback - Función a llamar después de conectar el cliente
 */
const connect = async (baseUrl, clientId, clientSecret, callback = () => {}) => {
  const keycloakClient = new KeycloakClient(baseUrl, clientId, clientSecret);

  await keycloakClient.init();

  keycloakClientInstance = keycloakClient;

  callback();
};

export default { connect, createUmaResource, createResourcePermission };
