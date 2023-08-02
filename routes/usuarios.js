const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const { check, query } = require('express-validator');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const {
    validarCampos,
    validarJWT,
    tieneRol,
} = require('../middlewares'); // Por eso le pusimos index.js al archivo que unifica todos los middlewares para no tener que especificar en la ruta el index.js. Esto se puede hacer debido a que asi se comporta la sintaxis de los proyectos .js, .html, etc
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router(); // A este router es al que se le configuran las rutas

// //Anteriormente era this.app.get(/api)...
// router.get('/', (req, res) => { // Se deja el root (/) porque la ruta ahora esta definida en el middleware
//     res.json({
//         msg: 'getAPI'
//     });
// });

// usuarios/10, el 10 se le conoce como parametro de segmento. Muy utilizado para obtener informacion
// usuarios?estequery=10, ?estequery es un query param. Muy utilizado en paginacion. Los query params son considerados opcionales
// para concatenar query params es con amperson &
// los middlewares del router tienen que ser una función para que el router pueda manejarlos
router.get('/', [
    //El metodo query obtiene los query params pasados en la url
    query('desde', 'El valor de desde debe ser numérico').isNumeric().optional(),
    query('limite', 'El valor de limite debe ser numérico').isNumeric().optional(),
    validarCampos,
], usuariosGet); // Se manda la referencia de la funcion. Cuando se ejecute el get, los argumentos se pasaran a usuariosGet para que este procese esa informacion
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ), // Se toma el id y se manda por referencia a la funcion existeUsuarioPorId
    check('rol').custom( esRolValido ).optional(), // Se le pasa el rol por referencia
    validarCampos
], usuariosPut); //:id es un parametro dinamico; :id? lo hace opcional(?)
router.post('/', [
    check('nombre', 'El nombre no es válido').not().isEmpty(), // Todos estos middleware check tienen una funcion interna next que se ejecuta despues de realizar la validacion
    check('password', 'El password debe contener mas de 6 caracteres').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail().custom( emailExiste ), // verifica si el campo correo existe y es un email. Se pueden encadenar mas acciones, incluida validaciones custom
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRolValido ), // Se le pasa el rol por referencia
    validarCampos // Este middleware revisa los errores de cada uno de los checks anteriores. Por eso se pone este hasta el final. Los datos pasan por referencia. Es el que retorna la respuesta de error en caso de que haya algun error.
], usuariosPost); // El arreglo es un array de handlers o middlewares. Si  algo sale mal, se almacenan los errores en este punto y se pueden manejar en el codigo del post (usuarios controllers)
router.delete('/:id', [
    //Protección de rutas
    // Se acostumbra que el token de acceso vaya en los headers de la peticion
    validarJWT, // Middleware de autenticacion,
    // esAdminRol, // Middleware de verificación de roles administrativos (lo fuerza)
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'), // Middleware de verificación de roles, mas flexible, dinamico. Se le manda la lista de roles que DEBEN de existir
    check('id', 'No es un ID válido').isMongoId().if(isValidObjectId).custom( existeUsuarioPorId ), // Se toma el id y se manda por referencia a la funcion existeUsuarioPorId
    validarCampos
], usuariosDelete);
router.patch('/', usuariosPatch);

module.exports = router; 