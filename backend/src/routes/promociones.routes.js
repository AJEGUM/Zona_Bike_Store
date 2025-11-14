// routes/promociones.routes.js
const router = require("express").Router();
const promocionesController = require("../controllers/promociones.controller");

router.post("/", promocionesController.crear);
router.get("/", promocionesController.listar);
router.put("/:id", promocionesController.actualizar);

// Subir imagen directo desde promociones
router.post("/imagen/:id", promocionesController.subirImagen);

module.exports = router;
