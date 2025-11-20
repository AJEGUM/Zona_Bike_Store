const StatsService = require("../services/estadisticas");

class StatsController {

    async productosMasVendidos(req, res) {
    try {
        const limit = Number(req.query.limit) || 10; // ← aquí está la solución

        const data = await StatsService.obtenerProductosMasVendidos(limit);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error en productos más vendidos" });
    }
    }


  async ventasPorPeriodo(req, res) {
    try {
      const { inicio, fin } = req.query;

      if (!inicio || !fin) {
        return res.status(400).json({ mensaje: "Debe enviar inicio y fin" });
      }

      const data = await StatsService.obtenerVentasPorPeriodo(inicio, fin);
      res.json(data);

    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error en ventas por periodo" });
    }
  }
}

module.exports = new StatsController();
