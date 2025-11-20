const express = require('express');
const router = express.Router();
const PasarelaController = require('../controllers/pasarela.controller');
const validarToken = require('../middlewares/validarToken');

router.post('/crear-orden', validarToken, PasarelaController.procesarPago);

module.exports = router;
