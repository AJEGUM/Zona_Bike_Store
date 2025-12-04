const express = require("express");
const router = express.Router();
const MarcasController = require("../controllers/marcas.controller");

router.get("/", MarcasController.listar);
router.get("/:id", MarcasController.obtener);
router.post("/", MarcasController.crear);
router.put("/:id", MarcasController.actualizar);
router.delete("/:id", MarcasController.eliminar);

module.exports = router;
