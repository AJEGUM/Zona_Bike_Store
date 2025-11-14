const express = require("express");
const router = express.Router();
const controller = require("../controllers/promociones.controller");

router.get("/", controller.obtener);
router.post("/", controller.crear);
router.put("/:id", controller.actualizar);
router.delete("/:id", controller.eliminar);

router.post("/:id/imagen", controller.subirImagen);

module.exports = router;
