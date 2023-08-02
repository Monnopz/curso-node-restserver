const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const tieneRol  = require('../middlewares/validar-roles');

module.exports = { // Exporta un solo objeto con todas las propiedades
    ...validarCampos,
    ...validarJWT,
    ...tieneRol
}