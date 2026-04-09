const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

// Ruta para que Meta verifique (GET) y para recibir mensajes (POST)
router.get('/', whatsappController.verifyWebhook);
router.post('/', whatsappController.receiveMessage);

module.exports = router;