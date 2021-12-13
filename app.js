//1.-Requerir librerías, drivers, variables de uso
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const Controller = require('./controllers/admin');

//2.-Configurar web server
const app = express();
const port = 443;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//3.- Apis disponibles
app.post('/api/adRequests',upload.none(), Controller.requestAdd);

//4.-Enciende web server
app.listen(port, () => {
  console.log('Server Inicializado en el puerto: ' + port);
});



