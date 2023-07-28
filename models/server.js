const express = require('express');
const cors = require('cors'); // CORS (Cross-Origin Resource Sharing): Protege endpoints para que sea accesible un endpoint desde cualquier recurso o ciertos recursos en especifico

class Server {

    constructor() {
        this.app = express(); // Se crea una app de express (Webserver)
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // Middlewares: Funcionalidades adicionales previo a carga de rutas
        this.middlewares();

        // Rutas de la aplicacion
        this.routes(); // Se llaman las rutas
    }

    middlewares() {

        //CORS
        this.app.use( cors() ); // Es un middleware porque utiliza el 'use'

        // Lectura y parseo del body
        this.app.use( express.json() ); //Cualquier información (POST, PUT) la serializa a JSON

        // Directorio publico
        this.app.use(express.static('public')); // use es la palabra clave para reconocer un middleware

    }

    routes() {
        
        this.app.use(this.usuariosPath, require('../routes/usuarios')); // Middleware para cargar las rutas

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }

}

module.exports = Server;