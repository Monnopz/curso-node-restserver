const { request, response } = require('express'); // Se realiza esto debido a que en Js el tipado no aplica y al igualar res = response tenemos todo el tipado a nuestra disposicion
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => { // Se deja el root (/) porque la ruta ahora esta definida en el middleware
    
    // const { q, nombre = 'No name', apiKey, page = 1, limit } = req.query; // Desestructurando se hace una pequeña validacion para que no truenen los endpoints con valores opcionales
    
    // res.json({
    //     q, 
    //     nombre, 
    //     apiKey,
    //     page,
    //     limit
    // });

    // const usuarios = await Usuario.find(); // Si no se le pasa un valor al metodo find, devuelve toda la coleccion
    
    const { desde = 0, limite = 5 } = req.query; // Query params
    const query = { estado: true }; // Query para obtener la respuesta filtrada
    // Paginacion
    // desde; del array de usuarios, desde donde empezará a traer la informacion (por ejemplo desde el usuario 6)
    // limite; la cantidad de datos que deberá traer el enpoint por consulta

    // const usuarios = await Usuario.find().skip(+desde).limit(+limite); // Se castea el limite que viene del query a un entero
    // Trae los usuarios activos (estado: true), es decir, que no han sido "eliminados" de la BD
    
    // // Estas dos lineas siguientes, al ejecutarse asi, es ineficiente
    // const usuarios = await Usuario.find(query).skip(desde).limit(limite); 
    // const total = await Usuario.countDocuments(query); // Al aplicar otra consulta, la respuesta se demora y no es eficiente debido a que el await es un codigo bloqueante

    // Promise.allSettled vs Promise.all: Cuando ejecutas la respuesta como un promise all, creo que es preferile un allSettled porque de esta manera si alguna de las peticiones falla, al menos obtienes la respuesta de la segunda.
    // Es decir, Promise.allSettled es utilizado para promesas que no son dependientes de otras, mientras que Promise.allSettled se utiliza en promesas que son dependientes unas de otras
    
    // total y usuarios se realiza con desestructuracion de array
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).skip(desde).limit(limite)
    ]) // Mandamos un array de promesas

    res.status(200).json({
        total,
        usuarios
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params; // Accedemos a los parametros y extraemos el id (id fue como se nombró en las rutas)
    const { _id, password, google, correo, ...resto } = req.body; // El _id tambien se extrae porque es un caso particular donde hay que procesarlo pero no se debe actualizar

    // Validar contra BD
    if( password ) { // Si es diferente de undefined; si viene el password
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); // El entero indica la cantidad de vueltas que dará el algrotimo para encriptar la contraseña. El valor por defecto es 10
        resto.password = bcryptjs.hashSync(password, salt); // Encriptar en una sola via
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, {new: true} ); // Busca por id y actualiza. Retorna un query con el objeto VIEJO que se actualizo. Para retornar el objeto actualizado se debe poner en el tercer argumento el objeto {new: true}

    res.status(200).json({
        usuario
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body; // req o request es la información que le llegó a este endpoint
    const usuario = new Usuario({nombre, correo, password, rol}); // Se crea la instancia. Se le debe decir a Mongoose que hay que grabar la data

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // El entero indica la cantidad de vueltas que dará el algrotimo para encriptar la contraseña. El valor por defecto es 10
    usuario.password = bcryptjs.hashSync(password, salt); // Encriptar en una sola via

    // Guardar en BD
    await usuario.save();

    res.status(200).json({
        usuario
    });
}

const usuariosDelete = async (req, res = response) => {
    // Ya no se acostumbra a borrar registros de la base de datos. Es mejor que tengan un estado y cambiarlo a false si ya no estarán activos. 
    // Esto como proposito de mantener integridad referencial.
    
    const { id } = req.params;

    // const uid = req.uid; // No se desestructura porque para llegar aqui se tuvo que pasar la validacion del jwt y se da por hecho que siempre tendrá un valor ya en este punto

    // Eliminado fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Cambiando el estado, buena practica
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, {new: true});
    const usuarioAutenticado = req.usuario; // El usuario que se obtuvo en validar-jwt.js ( y viene con todas las propiedades de mongo db)

    // Obtencion del usuario autenticado


    res.status(200).json({
        usuario
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