const { Router } = require('express');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

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
router.get('/', usuariosGet); // Se manda la referencia de la funcion. Cuando se ejecute el get, los argumentos se pasaran a usuariosGet para que este procese esa informacion
router.put('/:id?', usuariosPut); //:id es un parametro dinamico; :id? lo hace opcional(?)
router.post('/', usuariosPost);
router.delete('/', usuariosDelete);
router.patch('/', usuariosPatch);

module.exports = router; 