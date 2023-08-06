const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [ true, 'El nombre es obligatorio' ]
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    descripcion: {
        type: String
    },
    disponible: { // Productos en existencias (stock)
        type: Boolean,
        default: true
    },
    img: {
        type: String
    },
    usuario: { // Relacion para saber que usuario creo la categoria
        type: Schema.Types.ObjectId,
        ref: 'Usuario', // Asi como se pone aquí asi debe apuntar el archivo original de Schema usuario.js (model('Usuario', UsuarioSchema))
        required: true
    },
    categoria: { // Relacion para saber que usuario creo la categoria
        type: Schema.Types.ObjectId,
        ref: 'Categoria', // Asi como se pone aquí asi debe apuntar el archivo original de Schema usuario.js (model('Usuario', UsuarioSchema))
        required: true
    },
});

// Sobreescribiendo el metodo toJSON de Mongoose
ProductoSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...producto } = this.toObject(); // Genera la instancia como un objeto literal de Js y saca las propiedades
    const returnedObject = { uid: _id, ...producto };
    producto._id = _id;
    if (producto.usuario._id){
        producto.usuario.uid = producto.usuario._id
        delete producto.usuario._id
    }
    if (producto.categoria._id){
        producto.categoria.uid = producto.categoria._id
        delete producto.categoria._id
    }
    return returnedObject;
}


module.exports = model('Producto', ProductoSchema); // En singular el modelo