const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscarCategorias = async ( termino = '', res = response ) => {
    
    const esMongoID = ObjectId.isValid(termino); // True o false, verifica si es un ID de Mongo

    if( esMongoID ) {
        const categoria = await Categoria.find({ _id: termino, estado: true }).populate('usuario', 'nombre');
        return res.status(200).json({
            results: categoria ?? [] // Nullish coalescing, si el valor de la izquierda es nulo, toma el valor de la derecha
        });
    }

    // const regex = new RegExp( '\\w+', 'i' ); // La bandera i le dice que sea insensible a mayusculas/minusculas y va filtrando caracter por caracter

    // if(regex.test(termino)){
    //     console.log('PASOOOOOO-');
    // }

    //TODO: Validar la expresion regular para que no truene el programa cuando la consulta comienza con caracteres especiales

    const regex = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({ nombre: regex, estado: true}).populate('usuario', 'nombre'); // $or, propia de Moongo, es un operador or

    return res.status(200).json({
        results: categorias // Siemore retorna un arreglo, por eso no se hace validacion de Nullish
    });

}

const buscarProductos = async ( termino = '', res = response ) => {
    
    const esMongoID = ObjectId.isValid(termino); // True o false, verifica si es un ID de Mongo

    if( esMongoID ) {
        const producto = await Producto.find({ _id: termino, estado: true }).populate('usuario categoria', 'nombre');
        return res.status(200).json({
            results: producto ?? [] // Nullish coalescing, si el valor de la izquierda es nulo, toma el valor de la derecha
        });
    }

    // const regex = new RegExp( '\\w+', 'i' ); // La bandera i le dice que sea insensible a mayusculas/minusculas y va filtrando caracter por caracter

    // if(regex.test(termino)){
    //     console.log('PASOOOOOO-');
    // }

    //TODO: Validar la expresion regular para que no truene el programa cuando la consulta comienza con caracteres especiales

    const regex = new RegExp( termino, 'i' );

    const productos = await Producto.find({ nombre: regex, estado: true}).populate('usuario categoria', 'nombre'); // $or, propia de Moongo, es un operador or

    return res.status(200).json({
        results: productos // Siemore retorna un arreglo, por eso no se hace validacion de Nullish
    });

}

const buscarUsuarios = async ( termino = '', res = response ) => {
    
    const esMongoID = ObjectId.isValid(termino); // True o false, verifica si es un ID de Mongo

    if( esMongoID ) {
        const usuario = await Usuario.find({ _id: termino, estado: true });
        return res.status(200).json({
            results: usuario ?? [] // Nullish coalescing, si el valor de la izquierda es nulo, toma el valor de la derecha
        });
    }

    // const regex = new RegExp( '\\w+', 'i' ); // La bandera i le dice que sea insensible a mayusculas/minusculas y va filtrando caracter por caracter

    // if(regex.test(termino)){
    //     console.log('PASOOOOOO-');
    // }

    //TODO: Validar la expresion regular para que no truene el programa cuando la consulta comienza con caracteres especiales

    const regex = new RegExp( termino, 'i' );

    const usuarios = await Usuario.find({ $or: [{nombre: regex}, {correo: regex}], estado: true}); // $or, propia de Moongo, es un operador or

    return res.status(200).json({
        results: usuarios // Siemore retorna un arreglo, por eso no se hace validacion de Nullish
    });

}

const buscar = ( req = request, res = response ) => {

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se le olvidó realizar la busqueda'
            });
            break
    }
}

module.exports = {
    buscar
}