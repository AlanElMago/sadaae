import express from 'express';
import { auth } from 'express-openid-connect';
import http from 'http2';

import config from './config/config.js';
import openidConfig from './config/openidConfig.js';

const app = express();

// middleware
app.use(express.json());
app.use(auth(openidConfig));

// rutas
app.get('/api', (req, res) => res.status(http.constants.HTTP_STATUS_OK).json({ message: 'Hola, Mundo!' }));

// iniciar el servidor
app.listen(config.API_PORT);
