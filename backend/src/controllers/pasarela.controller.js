const PagoService = require('../services/pasarela');

class PasarelaController {

  async procesarPago(req, res) {
    try {
      const idUsuario = req.user.id; // viene del JWT
      const data = req.body;

      const resultado = await PagoService.procesarPago(data, idUsuario);

      return res.json({
        ok: true,
        mensaje: resultado.mensaje,
        id_venta: resultado.id_venta
      });
    } catch (error) {
      console.error("Error en el procesamiento del pago:", error);
      return res.status(500).json({
        ok: false,
        mensaje: error.message || "Error al procesar el pago."
      });
    }
  }
}

module.exports = new PasarelaController();
