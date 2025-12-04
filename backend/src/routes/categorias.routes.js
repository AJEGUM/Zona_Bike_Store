const express = require("express");
const router = express.Router();
const CategoriasController = require("../controllers/categorias.controller");

router.get("/", CategoriasController.listar);
router.get("/:id", CategoriasController.obtener);
router.post("/", CategoriasController.crear);
router.put("/:id", CategoriasController.actualizar);
router.delete("/:id", CategoriasController.eliminar);

module.exports = router;
