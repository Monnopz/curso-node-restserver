const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Sobreescribiendo el metodo toJSON de Mongoose
UsuarioSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject(); // Genera la instancia como un objeto literal de Js y saca las propiedades
    return user;
}

module.exports = model('Usuario', UsuarioSchema); // Mongoose por defecto le pondrá Usuarios