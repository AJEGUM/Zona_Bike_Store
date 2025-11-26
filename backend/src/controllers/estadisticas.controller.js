const statsService = require("../services/estadisticas");

class StatsController {

    async productosMasVendidos(req, res) {
    try {
        const limit = Number(req.query.limit) || 10; // ← aquí está la solución

        const data = await statsService.obtenerProductosMasVendidos(limit);
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

      const data = await statsService.obtenerVentasPorPeriodo(inicio, fin);
      res.json(data);

    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error en ventas por periodo" });
    }
  }

  async ventasPorCategoriaMes(req, res) {
    try {
      const { mes, anio, categoria } = req.query;

      if (!mes || !anio || !categoria) {
        return res.status(400).json({
          ok: false,
          msg: "Debe enviar mes, año y categoría"
        });
      }

      const data = await statsService.obtenerVentasPorCategoriaMes(
        mes,
        anio,
        categoria
      );

      res.json({
        ok: true,
        data
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Error en el servidor"
      });
    }
  }
}

module.exports = new StatsController();
