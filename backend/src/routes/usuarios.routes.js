const express = require('express');
const UsuariosController = require('../controllers/usuarios.controller');

const router = express.Router();
const usuariosController = new UsuariosController();

router.get('/roles', (req, res) => usuariosController.obtenerRoles(req, res));
router.put('/:id', (req, res) => usuariosController.editarUsuario(req, res));
router.get('/', (req, res) => usuariosController.obtenerUsuarios(req, res));
router.post('/', (req, res) => usuariosController.agregarUsuario(req, res));
router.delete('/:id', (req, res) => usuariosController.eliminarUsuario(req, res));

module.exports = router;
