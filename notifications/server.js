import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import config from './config/config.js';
import validateJwt from './middleware/validateJwt.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('No se encontró el token de acceso'));
  }

  validateJwt(token, (error, decoded) => {
    if (error) {
      console.error('Error al validar token de acceso', error);

      return next(new Error('Token invalido'));
    }

    socket.user = {
      id: decoded.payload.sub,
      roles: decoded.payload.realm_access?.roles || [],
    };

    if (socket.user.roles.includes('operator') ||
        socket.user.roles.includes('admin') ||
        socket.user.roles.includes('api')) {
      return next();
    }

    socket.emit('error', 'No tienes permiso para unirte a este servidor');
    socket.disconnect(true);

    return next(new Error(`Usuario ${socket.user.id} tiene permiso para unirse a este servidor`));
  });
});

io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.user.id}`);

  socket.join('emergency-alerts');

  socket.on('test-send-message', (data) => {
    console.log(`Mensaje recibido: ${data.message}`);

    io.to('emergency-alerts').emit('test-response-message', data);
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.user.id}`);
  });
});

server.listen(
  config.NOTIFICATIONS_PORT,
  () => console.log(`Servidor escuchando en el puerto ${config.NOTIFICATIONS_PORT}`),
);
