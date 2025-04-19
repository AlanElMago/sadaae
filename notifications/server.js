import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import config from './config/config.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.join('emergency-alerts');

  socket.on('test-send-message', (data) => {
    console.log(`Mensaje recibido: ${data.message}`);

    io.to('emergency-alerts').emit('test-response-message', data);
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

server.listen(
  config.NOTIFICATIONS_PORT,
  () => console.log(`Servidor escuchando en el puerto ${config.NOTIFICATIONS_PORT}`),
);
