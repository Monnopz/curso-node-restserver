// Este codigo se realizó asi para trabajar con la nomenclatura async/await en el auth.js
// Debido a que el paquete jsonwebtoken trabaja con promesas .then
// JWT (JSON Web Token):Se componen del header, payload y la firma. El header contiene informacion del algoritmo de encriptacion y el tipo de token. El payload contiene la info que queremos que contenga el token. La firma le permite a los verificadores del JWT verificar que es valido.
const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) => {
    // El uid será lo unico que se grabe del usuario. POR SEGURIDAD
    return new Promise( (resolve, reject) => {

        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, { expiresIn: '4h' }, (err, token) =>{

            if(err) {
                console.log(error);
                reject('No se pudo generar el JWT');
            }
            else {
                resolve(token);
            }

        }); // payload, secret key (la clave secreta con la cual se podran firmar tokens y validarlos), expiracion, callback final

    });

}

module.exports = {
    generarJWT
}