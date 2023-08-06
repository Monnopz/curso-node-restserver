const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivo } = require('../middlewares');
const { cargarArchivo, actualizarArchivoCloudinary, mostrarImagen } = require('../controllers/uploads');

// const { coleccionesPermitidas } = require('../helpers');

const router = Router();

// Se sigue el estandar
// Para subir archivo: POST
// Para actualizar archivo: PUT

router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo, // Middleware para validar el archivo
    check('id', 'No es un ID válido').isMongoId(),
    // check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    check('coleccion', 'No es una coleccion permitida').isIn(['usuarios', 'productos']), // valida los campos que deberian venir
    validarCampos
], actualizarArchivoCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    // check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] ) ),
    check('coleccion', 'No es una coleccion permitida').isIn(['usuarios', 'productos']), // valida los campos que deberian venir
    validarCampos
], mostrarImagen);

module.exports = router;