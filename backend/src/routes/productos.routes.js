const express = require('express');
const UsuariosController = require('../controllers/productos.controller');
const router = express.Router();
const usuariosController = new UsuariosController();

router.get('/', (req, res) => usuariosController.obtenerProductosController(req, res));

module.exports = router;
