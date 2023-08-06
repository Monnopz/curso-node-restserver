const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const tieneRol  = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validar-archivo');

module.exports = { // Exporta un solo objeto con todas las propiedades
    ...validarCampos,
    ...validarJWT,
    ...tieneRol, 
    ...validarArchivo
}