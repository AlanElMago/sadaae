import express from 'express';
import http from 'http2';

import config from './config/config.js';
import requireAuth from './middleware/requireAuth.js';
import validateJwt from './middleware/validateJwt.js';
import authTestRoutes from './test/routes/authTest.routes.js';

const app = express();

// middleware
app.use(express.json());
app.use(validateJwt);

// rutas
app.get('/api', (req, res) => res.status(http.constants.HTTP_STATUS_OK).json({ message: 'Hola, Mundo!' }));
app.use('/api/test/auth', requireAuth(), authTestRoutes);

// iniciar el servidor
app.listen(config.API_PORT, () => console.log(`Servidor escuchando en el puerto ${config.API_PORT}`));
