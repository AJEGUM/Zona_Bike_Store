const CategoriasService = require("../services/categorias");

class CategoriasController {

  async listar(req, res) {
    try {
      const data = await CategoriasService.obtenerCategorias();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtener(req, res) {
    try {
      const { id } = req.params;
      const data = await CategoriasService.obtenerCategoria(id);

      if (!data) return res.status(404).json({ error: "Categoría no encontrada" });

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async crear(req, res) {
    try {
      const { nombre } = req.body;
      const data = await CategoriasService.crearCategoria(nombre);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      const data = await CategoriasService.actualizarCategoria(id, nombre);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await CategoriasService.eliminarCategoria(id);
      res.json({ mensaje: "Categoría eliminada" });

    } catch (error) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }

}

module.exports = new CategoriasController();
