const MarcasService = require("../services/marcas");

class MarcasController {

  async listar(req, res) {
    try {
      const data = await MarcasService.obtenerMarcas();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtener(req, res) {
    try {
      const { id } = req.params;
      const data = await MarcasService.obtenerMarca(id);

      if (!data) return res.status(404).json({ error: "Marca no encontrada" });

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async crear(req, res) {
    try {
      const { nombre } = req.body;
      const data = await MarcasService.crearMarca(nombre);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      const data = await MarcasService.actualizarMarca(id, nombre);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await MarcasService.eliminarMarca(id);
      res.json({ mensaje: "Marca eliminada" });

    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

}

module.exports = new MarcasController();
