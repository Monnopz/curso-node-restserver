const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

module.exports = { // Se esparcen las propiedades de esos objetos
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}