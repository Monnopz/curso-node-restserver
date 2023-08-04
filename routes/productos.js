const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const { check, query } = require('express-validator');

const { validarJWT, validarCampos, tieneRol } = require('../middlewares');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todos los productos - publico
router.get('/', [
    //El metodo query obtiene los query params pasados en la url
    query('desde', 'El valor de desde debe ser numérico').isNumeric().optional(),
    query('limite', 'El valor de limite debe ser numérico').isNumeric().optional(),
    validarCampos
], obtenerProductos);

// Obtener un producto por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( existeProducto ), // Validacion para revisar si existe el producto en la BD
    validarCampos
], obtenerProducto);

// Crear producto - privado - cualquier rol - token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio').isNumeric().optional(),
    check('categoria', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( existeCategoria ),
    validarCampos
], crearProducto);

// Actualizar producto - privado - cualquiero rol - token valido
router.put('/:id', [
    validarJWT,
    check('nombre').optional(),
    check('precio').isNumeric().optional(),
    check('disponible').isBoolean().optional(),
    check('categoria', 'No es un ID de categoria válido').isMongoId().optional().if(isValidObjectId).custom( existeCategoria ),
    check('id', 'No es un ID de producto válido').isMongoId().if(isValidObjectId).custom( existeProducto ), // Validacion para revisar si existe el producto en la BD
    validarCampos
], actualizarProducto);

// Borrar producto - privado - admin role - token valido - estado false
router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROLE'), // Middleware de verificación de roles, mas flexible, dinamico. Se le manda la lista de roles que DEBEN de existir
    check('id', 'No es un ID de producto válido').isMongoId().if(isValidObjectId).custom( existeProducto ), // Validacion para revisar si existe el producto en la BD
    validarCampos
], borrarProducto);

module.exports = router;