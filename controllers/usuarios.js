const { request, response } = require('express'); // Se realiza esto debido a que en Js el tipado no aplica y al igualar res = response tenemos todo el tipado a nuestra disposicion

const usuariosGet = (req = request, res = response) => { // Se deja el root (/) porque la ruta ahora esta definida en el middleware
    
    const { q, nombre = 'No name', apiKey, page = 1, limit } = req.query; // Desestructurando se hace una pequeña validacion para que no truenen los endpoints con valores opcionales
    
    res.json({
        msg: 'getAPI - controlador',
        q, 
        nombre, 
        apiKey,
        page,
        limit
    });
}

const usuariosPut = (req, res = response) => {

    const { id } = req.params; // Accedemos a los parametros y extraemos el id (id fue como se nombró en las rutas)

    res.status(500).json({
        msg: 'putAPI - controlador',
        id
    });
}

const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body; // req o request es la información que le llegó a este endpoint

    res.status(201).json({
        msg: 'postAPI - controlador',
        nombre,
        edad
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'deleteAPI - controlador'
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patchAPI - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}