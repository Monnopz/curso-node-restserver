class Mensaje {

    constructor( uid, nombre, mensaje ) {
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }

}

class ChatMensajes {

    constructor() {

        this.mensajes = [];
        this.usuarios = {};

    }

    get ultimos10() {
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }

    get usuariosArr() {
        return Object.values(this.usuarios); // [ {}, {}, {} ]
    }

    enviarMensaje( uid, nombre, mensaje ) {
        this.mensajes.unshift( // Inserta el mensaje al principio del array
            new Mensaje(uid, nombre, mensaje)
        );
    }

    conectarUsuario( usuario ) { // Asi mantenemos a todos los usuarios indexados en el objeto
        this.usuarios[usuario.id] = usuario; 
    }

    desconectarUsuario( id ) { // Asi eliminamos al usuario
        delete this.usuarios[id];
    }

}

module.exports = ChatMensajes;