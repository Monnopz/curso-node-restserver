const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const { check, query } = require('express-validator');

const { validarJWT, validarCampos, tieneRol } = require('../middlewares');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', [
    //El metodo query obtiene los query params pasados en la url
    query('desde', 'El valor de desde debe ser numérico').isNumeric().optional(),
    query('limite', 'El valor de limite debe ser numérico').isNumeric().optional(),
    validarCampos
], obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( existeCategoria ), // Validacion para revisar si existe la categoria en la BD
    validarCampos
], obtenerCategoria);

// Crear categoria - privado - cualquier rol - token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar categoria - privado - cualquiero rol - token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( existeCategoria ), // Validacion para revisar si existe la categoria en la BD
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

// Borrar categoria - privado - admin role - token valido - estado false
router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROLE'), // Middleware de verificación de roles, mas flexible, dinamico. Se le manda la lista de roles que DEBEN de existir
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( existeCategoria ), // Validacion para revisar si existe la categoria en la BD
    validarCampos
], borrarCategoria);

module.exports = router;