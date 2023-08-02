const { request, response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");


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

module.exports = {
    login
}