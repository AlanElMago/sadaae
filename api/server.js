import express from 'express';
import http from 'http2';

import config from './config/config.js';

const app = express();

// middleware
app.use(express.json());

// rutas
app.get('/api', (req, res) => res.status(http.constants.HTTP_STATUS_OK).json({ message: 'Hola, Mundo!' }));

// iniciar el servidor
app.listen(config.API_PORT);
