import http from 'http2';

const protect = (req, res) => {
  console.log('Ruta protegida');
  return res.status(http.constants.HTTP_STATUS_OK).json({ message: 'Ruta protegida' });
};

const customer = (req, res) => {
  console.log('Ruta de cliente');
  return res.status(http.constants.HTTP_STATUS_OK).json({ message: 'Ruta de cliente' });
}

const camera = (req, res) => {
  console.log('Ruta de cámara');
  return res.status(http.constants.HTTP_STATUS_OK).json({ message: 'Ruta de cámara' });
}

const operator = (req, res) => {
  console.log('Ruta de operador');
  return res.status(http.constants.HTTP_STATUS_OK).json({ message: 'Ruta de operador' });
}

const admin = (req, res) => {
  console.log('Ruta de administrador');
  return res.status(http.constants.HTTP_STATUS_OK).json({ message: 'Ruta de administrador' });
}

export default { protected: protect, customer, camera, operator, admin };
