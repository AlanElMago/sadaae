import config from '../../config/config.js';
import keycloakClient from '../../keycloakClient.js';

/**
 * Registra un recurso UMA de tipo "Establecimiento" en Keycloak
 * @param {string} originalUrl - URL original de la solicitud
 * @param {string} establishmentId - ID del establecimiento a registrar
 * @param {string} ownerId - ID del propietario del establecimiento
 * @param {string} ownerBearerToken - Bearer token del propietario del establecimiento
 * @returns {Promise<import('axios').AxiosResponse>} Promesa con el resultado de la operación
 */
const registerEstablishment = async (originalUrl, establishmentId, ownerId, ownerBearerToken) => {
  const resourceName = `establishment-${establishmentId}`;
  const resourceUri = `${originalUrl.replace('/api', '')}/${establishmentId}`;
  const createUmaResorceResponse = await keycloakClient.createUmaResource(resourceName, {
    displayName: resourceName,
    type: `${config.API_BASE_URL}${originalUrl.replace('/api', '')}`,
    owner: `${ownerId}`,
    ownerManagedAccess: true,
    uris: [resourceUri],
    resource_scopes: ['read', 'update', 'delete'],
  });
  
  const permissionName = `establishment-permission-${establishmentId}`;
  const createResourcePermissionResponse = await keycloakClient.createResourcePermission(
    permissionName,
    createUmaResorceResponse.data._id,
    ownerBearerToken, {
      description: `Permiso que aplica al cliente ${ownerId} para acceder al establecimiento ${establishmentId}`,
      scopes: ['read', 'update', 'delete'],
      users: [`${ownerId}`],
  });

  return createResourcePermissionResponse;
};

/**
 * Registra un recurso UMA de tipo "Cámara" en Keycloak
 * @param {*} originalUrl - URL original de la solicitud
 * @param {*} cameraId - ID de la cámara a registrar
 * @param {*} ownerId - ID del propietario de la cámara
 * @param {*} ownerBearerToken - Bearer token del propietario de la cámara
 * @returns {Promise<import('axios').AxiosResponse>} Promesa con el resultado de la operación
 */
const registerCamera = async (originalUrl, cameraId, ownerId, ownerBearerToken) => {
  const resourceName = `camera-${cameraId}`;
  const resourceUri = `${originalUrl.replace('/api', '')}/${cameraId}`;
  const createUmaResorceResponse = await keycloakClient.createUmaResource(resourceName, {
    displayName: resourceName,
    type: `${config.API_BASE_URL}${originalUrl.replace('/api', '')}`,
    owner: `${ownerId}`,
    ownerManagedAccess: true,
    uris: [
      resourceUri,
      `${resourceUri}/assign-establishment`,
    ],
    resource_scopes: ['read', 'update'],
  });

  const permissionName = `camera-permission-${cameraId}`;
  const createResourcePermissionResponse = await keycloakClient.createResourcePermission(
    permissionName,
    createUmaResorceResponse.data._id,
    ownerBearerToken, {
      description: `Permiso que aplica al cliente ${ownerId} para acceder a la cámara ${cameraId}`,
      scopes: ['read', 'update'],
      users: [`${ownerId}`],
  });

  return createResourcePermissionResponse;
}

export default { registerEstablishment, registerCamera };
