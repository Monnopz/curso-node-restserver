const { Usuario, Categoria, Producto } = require('../models');
const Rol = require('../models/rol');

const esRolValido = async( rol = '' ) => { // Realizar validacion manual
    const existeRol = await Rol.findOne({rol});
    if(!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`); // Se atrapa el error
    }
}

const emailExiste = async( correo = '' ) => {
    // Verificar si el correo existe (el modelo ya verifica, pero haciendolo desde aqui evitamos que se mande todo el body de nuevo a mongo)
    const existeEmail = await Usuario.findOne({ correo });
    if( existeEmail ) {
        throw new Error(`El correo ${correo} ya ha sido utilizado`);
        // return res.status(400).json({
        //     msg: 'El correo ya está registrado'
        // });
    }
}

const existeUsuarioPorId = async( id = '' ) => {
    // Verificar si el id de mongo existe
    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario ) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeCategoria = async( id = '' ) => {
    // Verificar si el id de mongo existe
    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria ) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeProducto = async( id = '' ) => {
    // Verificar si el id de mongo existe
    const existeProducto = await Producto.findById(id);
    if( !existeProducto ) {
        throw new Error(`El id ${id} no existe`);
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes(coleccion);

    if(!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida [${colecciones}]`)
    }

    return true;

}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}