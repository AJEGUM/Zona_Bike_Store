const express = require('express');
const router = express.Router();
const qrController = require('../controllers/whatsappQr.controller');

// Ruta para desconectar el QR manualmente
router.post('/logout', qrController.logout);

module.exports = router;