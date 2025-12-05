// routes/pasarela.routes.js
const express = require('express');
const router = express.Router();
const PagoService = require('../services/pasarela');
const validarToken = require('../middlewares/validarToken');

router.post('/crear-orden', validarToken, async (req, res) => {
  try {
    const idUsuario = req.user.id_usuario; // del token
    const data = req.body;

    if (!idUsuario) return res.status(401).json({ mensaje: "Usuario no autorizado" });

    const resultado = await PagoService.procesarPago(data, idUsuario);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;
