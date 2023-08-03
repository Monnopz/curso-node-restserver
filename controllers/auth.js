const { request, response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - correo'
            });
        }

        // Verificar si el usuario está activo en BD
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password); // Compara la contraseña plana con la contraseña de la BD hasheada (realiza una firma de encriptacion para verificar si las password hacen match)
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - password'
            });
        }

        // Generar el JWT
        // Se instala paquete jsonwebtoken
        const token = await generarJWT( usuario.id ); //Metodo manual creado por nosotros para aprovevhar la nomenclatura async/await
        
        res.status(200).json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const googleSignIn = async( req = request, res = response ) => {

    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if(!usuario) {
            // Crear al usuario si no existe
            
            const data = {
                nombre,
                correo,
                password: '123456',
                img,
                rol: 'USER_ROLE',
                google: true
            };

            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync(); // El entero indica la cantidad de vueltas que dará el algrotimo para encriptar la contraseña. El valor por defecto es 10
            const password = data.password;
            data.password = bcryptjs.hashSync(password, salt); // Encriptar en una sola via

            usuario = new Usuario( data );
            await usuario.save();

        }

        // Si el usuario en DB estpa desactivado, pero se detecta la misma cuenta al hacer SignIn de Google
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador. Usuario bloqueado'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id );

        res.status(200).json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'El token no se pudo verificar'
        });
    }

}

module.exports = {
    login,
    googleSignIn
}