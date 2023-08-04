const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario  = require('../models/usuario');

const validarJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(400).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        // Si hay un token y es valido pasa el middleware

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); // token, secretKey; se obtiene { uid } que es una propiedad del objeto payload
        
        // TODO: Validar que el token que llega sea el del usuario y que hagan match. Usuario puede eliminarse a si mismo, Admin Usuario puede eliminar varios usuarios

        //TODO: Validar que si se accede a una ruta y el token vención, hacer de nuevo la autenticacion o mandar excepcion de error

        // Leer el usuario en Mongo que corresponde al uid y guardarlo en la request
        const usuario = await Usuario.findById(uid);

        if(!usuario) { //Si el usuario no existe
            return res.status(400).json({
                msg: 'Usuario no existe en bd"'
            });
        }

        // Verificar si el uid tiene estado en true (usuario activo)
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Token no valido - usuario "eliminado"'
            });
        }

        req.usuario = usuario; // Este usuario que llega de mongo tiene las propiedades/getters virtuales propias de su bd, incluyendo el _id
        // req.uid = uid; // Creacion de propiedad uid en la request, que pasará por referencia hasta el controlador de delete
        
        next();
        
    } catch (error) {
        // Si hay un token, pero no es valido, cae en la excepcion

        console.log(error);
        res.status(400).json({
            msg: 'Token no valido'
        });

    }

}

module.exports = {
    validarJWT
}