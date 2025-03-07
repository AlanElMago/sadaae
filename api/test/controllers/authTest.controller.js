import http from 'http2';

const protect = (req, res) => {
  console.log('Ruta protegida');
  return res.status(http.constants.HTTP_STATUS_OK).json({ message: 'Ruta protegida' });
};

export default { protect };
