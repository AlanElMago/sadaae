import express from 'express';
import http from 'http2';
import mongoose from 'mongoose';

import keycloakClient from './keycloakClient.js';
import config from './config/config.js';
import mongooseConnectOptions from './config/mongooseConnectOptions.js';
import requireAuth from './middleware/requireAuth.js';
import validateJwt from './middleware/validateJwt.js';
import authTestRoutes from './test/routes/authTest.routes.js';
import fileTestRoutes from './test/routes/fileTest.routes.js';
import geminiTestRoutes from './test/routes/geminiTest.routes.js';
import cameraRoutes from './v1/routes/camera.routes.js';
import customerRoutes from './v1/routes/customer.routes.js';
import establishmentRoutes from './v1/routes/establishment.routes.js';
import imageRoutes from './v1/routes/image.routes.js';
import reportRoutes from './v1/routes/report.routes.js';
import notificationService from './v1/services/notification.service.js';

await mongoose.connect(config.MONGO_URI, mongooseConnectOptions);
await keycloakClient.connect(config.KC_REALM_URL, config.KC_CLIENT_ID, config.KC_CLIENT_SECRET, () => {
  console.log('Conexión a Keycloak exitosa');
});
await notificationService.connect();

const app = express();

// middleware
app.use(express.json());
app.use(validateJwt);

// rutas
app.get('/api', (req, res) => res.status(http.constants.HTTP_STATUS_OK).json({ message: 'Hola, Mundo!' }));
app.use('/api/v1/establishments', establishmentRoutes);
app.use('/api/v1/cameras', cameraRoutes);
app.use('/api/v1/customer', customerRoutes);
app.use('/api/v1/images', imageRoutes);
app.use('/api/v1/reports', reportRoutes);

app.use('/api/test/auth', requireAuth(), authTestRoutes);
app.use('/api/test/file', fileTestRoutes);
app.use('/api/test/gemini', geminiTestRoutes);

// iniciar el servidor
app.listen(config.API_PORT, () => console.log(`Servidor escuchando en el puerto ${config.API_PORT}`));
