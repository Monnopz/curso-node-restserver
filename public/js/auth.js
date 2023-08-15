// Referencias HTML
const miFormulario = document.querySelector('form'); // Se puede hacer así porque solo hay un formulario


const url = ( window.location.hostname.includes('https') )
            ? 'https://curso-node-restserver-production-78f8.up.railway.app/api/auth'
            : 'http://localhost:8080/api/auth';

miFormulario.addEventListener('submit', event => { // Controlaremos de manera manual el envio del formulario
    // Este evento tiene la habilidad de que por defecto manda información al backend
    event.preventDefault();
    const formData = {};

    for( const element of miFormulario.elements ){ // Barre los elementos del formulario
        if(element.name.length > 0) { // Obtiene la propiedad name del input
            formData[element.name] = element.value; // Agrega al objeto que acabamos de crear los valores
        }
    }

    fetch(`${url}/login`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
    }) // Con fetch se serializa la respuesta
        .then( resp => resp.json() ) // Readable Stream se serializa
        .then( resp => { // Respuesta serializada
            if(resp.msg) {
                return console.log(resp.msg);
            }
            localStorage.setItem('correo', resp.usuario.correo);
            localStorage.setItem('token', resp.token);
            window.location = 'chat.html';
            console.log(resp);
        })
        .catch(console.warn);
});


function handleCredentialResponse(response) {
    // Esta funcion de google no funciona con una de flecha
    //Google Token: ID_TOKEN
    // console.log('id token', response.credential);

    const body = { id_token: response.credential };

    fetch(`${url}/google`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    }) // Con fetch se serializa la respuesta
        .then( resp => resp.json() ) // Readable Stream se serializa
        .then( resp => { // Respuesta serializada
            localStorage.setItem('correo', resp.usuario.correo);
            localStorage.setItem('token', resp.token);
            window.location = 'chat.html';
            console.log(resp);
        })
        .catch(console.warn);
}

const button = document.getElementById('google_signout');
button.onclick = function() {
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke( localStorage.getItem('correo'), done => {
        localStorage.clear();
        location.reload(); // Recargar la pagina
    }) // Logout del usuario; 
}