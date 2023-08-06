const path = require('path'); // Obtiene los paths o rutas de archivos
const fs = require('fs'); // Permite la manipulacion de archivos mediante paths

const { request, response } = require("express");

const cloudinary = require('cloudinary').v2; //Importacion de Clodinary

cloudinary.config( process.env.CLOUDINARY_URL ); // Configuracion de Cloudinary con la variable de entorno

const { subirArchivo } = require("../helpers"); // Esta en el index.js

const { Usuario, Producto } = require('../models');

// Se utiliza el paquete de npm express-fileupload para realizar la carga de archivos aprovechando la carga con express

const cargarArchivo = async ( req = request, res = response ) => {

    try {
        // Imagenes
        // Primer argumento, files
        // Segundo argumento, en este caso, se deja por defecto
        const nombre = await subirArchivo( req.files, undefined, 'imgs' ); 

        res.status(200).json({
            nombre
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }

}

const actualizarArchivo = async( req = request, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findOne({ _id: id, estado: true });
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findOne({ _id: id, estado: true });
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Faltan validaciones'
            });
    }

    try {
        
        // Limpiar imagenes previas
        if( modelo.img ){
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            if( fs.existsSync( pathImagen ) ) {
                fs.unlinkSync(pathImagen); // Elimina el archivo
            }
        }

    } catch (error) {
        console.log(error);
    }

    try {
        const nombre = await subirArchivo( req.files, undefined, coleccion ); 

        modelo.img = nombre;

        await modelo.save();
    
        res.status(200).json({
            modelo
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }

}

const actualizarArchivoCloudinary = async( req = request, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findOne({ _id: id, estado: true });
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findOne({ _id: id, estado: true });
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Faltan validaciones'
            });
    }

    try {
        
        // Limpiar imagenes previas
        if( modelo.img ){
            // Hay que borrar la imagen del servidor
            const nombreArr = modelo.img.split('/'); // Se separa por / para obtener la ultima posicion del arreglo (donde se encuentra el nombre del archivo)
            const nombre = nombreArr[nombreArr.length-1];
            const [ public_id ] = nombre.split('.'); // Se desestructura el array al que se hace split para separar el nombre del archivo y la extension
            await cloudinary.uploader.destroy( public_id );
        }   

    } catch (error) {
        console.log(error);
    }

    try {

        // A cloudinary se le mandará el path temporal de MEMORIA que se crea (se puede ver mejor viendo todo el objeto req.files.archivo)
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

        modelo.img = secure_url;

        await modelo.save();
    
        return res.status(200).json({
            modelo
        });

    } catch (error) {
        return res.status(400).json({
            error
        });
    }

}

const mostrarImagen = async( req = request, res = response ) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findOne({ _id: id, estado: true });
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findOne({ _id: id, estado: true });
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Faltan validaciones'
            });
    }

    try {
        
        if( modelo.img ){
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
            if( fs.existsSync( pathImagen ) ) {
                //De esta manera solo se sirve la imagen y se esconde el path original al usuario final
                return res.status(200).sendFile(pathImagen); // Sirve una imagen
            }
        }

    } catch (error) {
        console.log(error);
    }

    // Respuesta de imagen por defecto en caso que el recurso no se encuentre o no lo tenga el producto/usuario
    const defaultPath = path.join(__dirname, '../assets', 'no-image.jpg');
    return res.status(200).sendFile(defaultPath);

}

module.exports = {
    cargarArchivo,
    actualizarArchivo,
    mostrarImagen,
    actualizarArchivoCloudinary
}