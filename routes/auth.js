const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT } = require('../middlewares');
const { login, googleSignIn, renovarToken } = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

// Ruta para el logueo con Google
router.post('/google', [
    check('id_token', 'Token de google es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);

// Ruta que valida una sesion con JWT
router.get('/', validarJWT, renovarToken); // renovarToken fungirá como un controlador para prolongar o cambiar un JWT valido

module.exports = router;