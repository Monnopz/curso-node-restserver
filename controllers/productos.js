const { request, response } = require("express");

const { Producto } = require("../models");

//TODO: VALIDAR EN TODOS LOS ENDPOINTS QUE EL PRODUCTO ESPECIFICO A MODIFICAR SU ESTADO SEA TRUE

const crearProducto = async ( req = request, res = response ) => {

    const { nombre, precio, descripcion = '', categoria, estado, usuario } = req.body;

    try {
        
        const productoDB = await Producto.findOne({ nombre: nombre.toUpperCase() });

        if(productoDB) { // Si la categoria existe
            return res.status(400).json({
                msg: `El producto ${productoDB.nombre} ya existe`
            });
        }
    
        // Generar la data a guardar
        const data = {
            nombre: nombre.toUpperCase(),
            precio,
            descripcion,
            usuario: req.usuario._id, // ID usuario Mongo, guardado gracias a Token
            categoria
        }
    
        const producto = new Producto(data); // Crear producto
        await producto.save(); // Guardar producto en DB

        res.status(201).json({
            producto
        });

    } catch (error) {
        console.log(error);
    }

}

// obtenerProductos - paginado opcional - total - populate
// Populate se hace la relacion para que aparezca la informacion de la tabla referenciada (en este caso de la tabla Usuario)
const obtenerProductos = async( req = request, res = response ) =>{

    const { desde = 0, limite = 5 } = req.query; // Datos que se obtienen de la query params
    const query = { estado: true }; // Query para obtener la respuesta filtrada

    try {

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            // En este caso, el populate hace referencia a la tabla con relacion (en este caso mediante el id del usuario que creó el producto)
            // populate ('modelo', 'que mostrar del modelo')
            Producto.find(query).populate('usuario categoria', 'nombre').skip(desde).limit(limite)
        ]) // Mandamos un array de promesas
    
        res.status(200).json({
            total,
            productos
        });

    } catch (error) {
        console.log(error);
    }

}


// obtenerProducto - populate {}
const obtenerProducto = async( req = request, res = response ) =>{
    
    const { id } = req.params; // id que llega en la url

    try {

        const producto = await Producto.findById(id).populate('usuario categoria', 'nombre');

        res.status(200).json({
            producto
        });

    } catch (error) {
        console.log(error);
    }

}

// actualizarProducto
const actualizarProducto = async( req = request, res = response ) =>{

    const { id } = req.params;
    
    const { precio = 0, disponible = '', estado, usuario, ...data } = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id; // Se desestructuro la propiedad como validacion y se agrega de nuevo desde aqui la propiedad correcta

    try {
        
        const productoDB = await Producto.findOne({ nombre: data.nombre });

        if(productoDB) { // Si la categoria existe
            return res.status(400).json({
                msg: `El producto ${productoDB.nombre} ya existe`
            });
        }

        const producto = await Producto.findByIdAndUpdate( id, data, {new: true} ).populate('usuario categoria', 'nombre'); // Busca por id y actualiza. Retorna un query con el objeto VIEJO que se actualizo. Para retornar el objeto actualizado se debe poner en el tercer argumento el objeto {new: true}

        res.status(200).json({
            producto
        });

    } catch (error) {
        console.log(error);
    }

}

// borrarProducto - estado: false
const borrarProducto = async( req = request, res = response ) =>{

    const { id } = req.params;

    try {
        
        const producto = await Producto.findByIdAndUpdate(id, { estado: false }, {new: true}).populate('usuario categoria', 'nombre');

        res.status(200).json({
            producto
        });

    } catch (error) {
        console.log(error);
    }

}


module.exports = {
    crearProducto, 
    obtenerProductos, 
    obtenerProducto, 
    actualizarProducto, 
    borrarProducto

}