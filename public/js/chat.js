// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const textMensaje = document.querySelector('#textMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

const url = ( window.location.hostname.includes('railway') )
            ? 'https://curso-node-restserver-production-78f8.up.railway.app/api/auth'
            : 'http://localhost:8080/api/auth';

let usuario = null;
let socket = null;

// Funcion que aplica la logica necesaria para borrar los datos y cerrar sesion
const localLogout = () => {
    localStorage.clear();
    window.location = 'index.html';
}

// Validar el token del localStorage
const validarJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if( token.length < 11 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json(); // Serializa la respuesta a un json y desestructura los valores

    localStorage.setItem('token', tokenDB); // Asigna el nuevo token
    usuario = userDB; // Asigna el usuario
    document.title = `ioChat - ${usuario.nombre}`;

    await conectarSocket( tokenDB );

}

// Boton lougout click
btnSalir.onclick = () => {
    localLogout();
}

const conectarSocket = async( token ) => {

    socket = io({
        'extraHeaders': {
            'x-token' : token
        }
    }); // Ejecutamos la conexion con el socket

    // socket.on('connect', () => {

    // });

    // socket.on('disconnect', () => {

    // });

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios); // callback dibujarUsuarios

    socket.on('mensaje-privado', () => {
        // TODO: Poner funcionalidad
    });

    // window.addEventListener('hashchange', () => { // Detecta cambios de url. En caso de que se haga click en el boton atras
        
    //     if(!window.location.hostname.includes('chat')){ // Si no está en la pagina del chat
    //         localLogout();
    //     }
    // });


}

const dibujarUsuarios = ( usuarios = [] ) => {

    let usersHtml = '';
    usuarios.forEach( ({ nombre, uid }) => { // se desestructuró el objeto user

        usersHtml += `
            <li>
                <p>
                   <h5 class="text-success">${nombre}</h5> 
                   <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `; // COn backtics tambien se puede hacer string multilinea

    });

    ulUsuarios.innerHTML = usersHtml;

}

const dibujarMensajes = ( mensajes = [] ) => {

    let mensajesHtml = '';
    mensajes.reverse().forEach( ({ nombre, mensaje }) => {

        mensajesHtml += `
            <li>
                <p>
                   <span class="text-primary">${nombre}: </span> 
                   <span>${mensaje}</span>
                </p>
            </li>
        `; // COn backtics tambien se puede hacer string multilinea

    });

    ulMensajes.innerHTML = mensajesHtml;

}

textMensaje.addEventListener('keyup', ({keyCode}) => { // se desestructura el objeto para sacar el keycode
    if( keyCode !== 13 ) { // Si no es un enter
        return;
    }
    const mensaje = textMensaje.value; // Lo que se encuentra en la caja de texto del mensaje en chat.html
    const uid = txtUid.value; 
    if( mensaje.length === 0 ) return; // QUe no envie mensajes vacios
    socket.emit('enviar-mensaje', { uid, mensaje }); // Se emite el mensaje
    txtUid.value = '';
    textMensaje.value = '';
    document.activeElement.blur(); // Quita el focus
});

const main = async() => {

    await validarJWT();

}

main();