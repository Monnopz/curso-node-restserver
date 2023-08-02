const { request, response } = require("express")

const esAdminRol = ( req = request, res = response, next ) => {

    if( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar primero el token'
        });
    }

    const { rol, nombre } = req.usuario;

    if( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No autorizado`
        });
    }

    next();

}

// Este middleware funcina un poco diferente de la manera tradicinal
// Tradicional: ( req = request, res = response, next )
const tieneRol = ( ...roles) => { // Espera una lista n de valores, es decir, el resto (aqui no es spread)
    // Tiene que retornar una funcion porque el arreglo de middlewares al final de tantos middlewares resuelve una funcion que es la que lee el router
    return ( req = request, res = response, next ) => {

        if( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar primero el token'
            });
        }

        if( !roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere alguno de estos roles ${roles}`
            });
        }

        next();

    }
}

module.exports = {
    esAdminRol,
    tieneRol
}