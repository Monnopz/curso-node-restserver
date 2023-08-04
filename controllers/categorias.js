const { request, response } = require("express");

const { Categoria, Usuario } = require("../models");

//TODO: VALIDAR EN TODOS LOS ENDPOINTS QUE LA CATEGORIA ESPECIFICA A MODIFICAR SU ESTADO SEA TRUE

const crearCategoria = async ( req = request, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    try {
        
        const categoriaDB = await Categoria.findOne({ nombre });

        if(categoriaDB) { // Si la categoria existe
            return res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre} ya existe`
            });
        }
    
        // Generar la data a guardar
        const data = {
            nombre,
            usuario: req.usuario._id // ID usuario Mongo, guardado gracias a Token
        }
    
        const categoria = new Categoria(data); // Crear categoria
        await categoria.save(); // Guardar categoria en DB

        res.status(201).json({
            categoria
        });

    } catch (error) {
        console.log(error);
    }

}

// obtenerCategorias - paginado opcional - total - populate
// Populate se hace la relacion para que aparezca la informacion de la tabla referenciada (en este caso de la tabla Usuario)
const obtenerCategorias = async( req = request, res = response ) =>{

    const { desde = 0, limite = 5 } = req.query; // Datos que se obtienen de la query params
    const query = { estado: true }; // Query para obtener la respuesta filtrada

    try {

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            // En este caso, el populate hace referencia a la tabla con relacion (en este caso mediante el id del usuario que creó la categoria)
            // populate ('modelo', 'que mostrar del modelo')
            Categoria.find(query).populate('usuario', 'uid nombre').skip(desde).limit(limite)
        ]) // Mandamos un array de promesas
    
        res.status(200).json({
            total,
            categorias
        });

    } catch (error) {
        console.log(error);
    }

}


// obtenerCategoria - populate {}
const obtenerCategoria = async( req = request, res = response ) =>{
    
    const { id } = req.params; // id que llega en la url

    try {

        const categoria = await Categoria.findById(id).populate('usuario', 'uid nombre');

        res.status(200).json({
            categoria
        });

    } catch (error) {
        console.log(error);
    }

}

// actualizarCategoria
const actualizarCategoria = async( req = request, res = response ) =>{

    const { id } = req.params;
    
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    try {
        
        const categoriaDB = await Categoria.findOne({ nombre: data.nombre });

        if(categoriaDB) { // Si la categoria existe
            return res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre} ya existe`
            });
        }

        const categoria = await Categoria.findByIdAndUpdate( id, data, {new: true} ).populate('usuario', 'uid nombre'); // Busca por id y actualiza. Retorna un query con el objeto VIEJO que se actualizo. Para retornar el objeto actualizado se debe poner en el tercer argumento el objeto {new: true}

        res.status(200).json({
            categoria
        });

    } catch (error) {
        console.log(error);
    }

}

// borrarCategoria - estado: false
const borrarCategoria = async( req = request, res = response ) =>{

    const { id } = req.params;

    try {
        
        const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, {new: true}).populate('usuario', 'uid nombre');

        res.status(200).json({
            categoria
        });

    } catch (error) {
        console.log(error);
    }

}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}