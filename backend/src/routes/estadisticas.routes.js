const express = require("express");
const router = express.Router();
const StatsController = require("../controllers/estadisticas.controller");

router.get("/productos-mas-vendidos", (req, res) => StatsController.productosMasVendidos(req, res));

router.get("/ventas-por-periodo", (req, res) => StatsController.ventasPorPeriodo(req, res));

module.exports = router;
