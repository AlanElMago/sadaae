import { io, Socket } from 'socket.io-client';

import config from '../../config/config.js';
import keycloakClient from '../../keycloakClient.js';

/**
 * Cliente de socket.io para conectarse al servidor de notificaciones.
 * @type {Socket}
 */
let socket = null;

/**
 * Conecta al servidor de notificaciones.
 */
const connect = async () => {
  try {
    const token = keycloakClient.getAccessToken();

    socket = io(config.NOTIFICATIONS_SERVER_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    socket.on('connect', () => {
      console.log('Conexión al servidor de notificaciones exitosa');
    });

    socket.on('disconnect', async () => {
      console.log('Desconectado del servidor de notificaciones. Intentando reconectar...');

      const token = await keycloakClient.refreshAccessToken();

      socket.auth = { token };
    });
  }
  catch (error) {
    console.error('Error al conectarse al servidor de notificaciones: ', error);
  }
}

/**
 * Envía una alerta de emergencia al servidor de notificaciones.
 * @param {string} report_id - ID del reporte de emitido.
 */
const sendNotificationAlert = async (report_id) => {
  if (!socket?.connected) {
    console.error('Desconectado del servicio de notificaciones. No se puede enviar la notificación');

    return;
  }

  try {
    socket.emit('alert', { 'report_id': report_id });
    console.log(`[${new Date().toISOString()}] Notificación enviada: ${report_id}`);
  }
  catch (error) {
    console.error('Error al enviar notificación de alerta: ', error);
  }
}

export default { connect, sendNotificationAlert };
