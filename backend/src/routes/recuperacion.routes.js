const express = require("express");
const router = express.Router();

const RecuperacionController = require("../controllers/recuperacion.controller");

router.post("/solicitar-codigo", RecuperacionController.solicitarCodigo);
router.post("/verificar-codigo", RecuperacionController.verificarCodigo);
router.post("/restablecer-clave", RecuperacionController.restablecerClave);

module.exports = router;
