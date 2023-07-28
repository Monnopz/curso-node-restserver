require('dotenv').config(); // Lee el .env y lo hace parte del process.env de Node. Se deja aqui en app.js debido a que este es el documento raiz del proyecto y esta linea estará presente de manera global

const Server = require('./models/server');

const server = new Server();

server.listen(); // Inicia el servidor