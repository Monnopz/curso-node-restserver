const { comprobarJWT } = require("../helpers");

const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes(); // Inicializacion del Chat

const socketController = async ( socket, io ) => {

    const token = socket.handshake.headers['x-token'] || '';

    const usuario = await comprobarJWT(token);

    if( !usuario ) { // Si no hay usuario
        return socket.disconnect(); 
    }

    // Agregar el usuario conectado
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuariosArr); // emite a todos, incluido el usuario responsable de la emision, debido a que en realidad el canal de emicion es todo el servidor de sockets
    socket.emit('recibir-mensajes', chatMensajes.ultimos10); // En caso de que se haga una nueva conexion, si hay mensajes en el server, se los manda tambien

    // Conectarlo a una sala especial (para habilitar el envio de mensajes privados)
    socket.join( usuario.id ); // sala global io, sala socket, sala usuario.id


    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () =>{
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr); // emite a todos, incluido el usuario responsable de la emision, debido a que en realidad el canal de emicion es todo el servidor de sockets
    });

    socket.on('enviar-mensaje', ({uid, mensaje}) => { // Se desestructura lo que se recibe
       
        if ( uid ) { // Mensaje privado
            socket.to( uid ).emit('mensaje-privado', { de: usuario.nombre, mensaje }); // gracias a la incorporacion de salas mediante el uid del usuario se pueden enviar mensajes solo al canal privado
        } else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje); // Se manda el usuario conectado (el emisor)
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }

    }); 

}

module.exports = {
    socketController
}