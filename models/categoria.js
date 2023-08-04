const { Schema, model } = require('mongoose');

const CategoriaSchema = new Schema({
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
    usuario: { // Relacion para saber que usuario creo la categoria
        type: Schema.Types.ObjectId,
        ref: 'Usuario', // Asi como se pone aquí asi debe apuntar el archivo original de Schema usuario.js (model('Usuario', UsuarioSchema))
        required: true
    }
});

// Sobreescribiendo el metodo toJSON de Mongoose
CategoriaSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...categoria } = this.toObject(); // Genera la instancia como un objeto literal de Js y saca las propiedades
    const returnedObject = { uid: _id, ...categoria };
    categoria._id = _id;
    if (categoria.usuario._id){
        categoria.usuario.uid = categoria.usuario._id
        delete categoria.usuario._id
    }
    return returnedObject;
}


module.exports = model('Categoria', CategoriaSchema); // En singular el modelo