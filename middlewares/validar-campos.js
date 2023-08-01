const { request, response } = require('express');
const { validationResult } = require("express-validator");

const validarCampos = ( req = request, res = response, next ) => { // Next es una funcion callback propia de los middlewares que se ejecuta si el presente middleware pasa
    const errors = validationResult(req);
    if(!errors.isEmpty()) { // Si hay errores (por la deteccion que realizaron los Middlewares)
        return res.status(400).json(errors);
    }
    next(); // Sigue con el siguiente middleware
}

module.exports = {
    validarCampos
}