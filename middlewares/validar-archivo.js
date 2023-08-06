const { request, response } = require("express")

const validarArchivo = ( req = request, res = response, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) { // Si vienen los files
        return res.status(400).json({
            msg: 'No se subieron archivos'
        });
    }
    next();
}

module.exports = {
    validarArchivo
}