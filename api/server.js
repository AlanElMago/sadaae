import express from 'express';
import { auth } from 'express-openid-connect';
import http from 'http2';

import config from './config/config.js';
import openidConfig from './config/openidConfig.js';
import authTestRouts from './test/routes/authTest.routes.js';

const app = express();

// middleware
app.use(express.json());
app.use(auth(openidConfig));
app.use((err, req, res, next) => {
  if (err.status === http.constants.HTTP_STATUS_UNAUTHORIZED) {
    return res.status(http.constants.HTTP_STATUS_UNAUTHORIZED).json({ message: 'No autorizado!' });
  }

  next(err);
})

// rutas
app.get('/api', (req, res) => res.status(http.constants.HTTP_STATUS_OK).json({ message: 'Hola, Mundo!' }));
app.use('/api/test/auth', authTestRouts);

// iniciar el servidor
app.listen(config.API_PORT);
