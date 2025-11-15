const e = require("express");
const ServicesProductos = require("../services/productos.services");

class Productos{

  async obtenerProductos(req, res) {
    try {
      const productos = await ServicesProductos.obtenerProductos();
      res.json(productos);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  async crearProducto(req, res) {
    try {
      const producto = req.body;
      const nuevoProducto = await ServicesProductos.crearProducto(producto);
      return res.status(201).json({ success: true, producto: nuevoProducto });
    } catch (err) {
      return res.status(500).json({ error: 'Error al crear producto' });
    }
  }

  async actualizarProducto(req, res) {
    try {
      const { id } = req.params;
      const producto = req.body;
      const actualizado = await ServicesProductos.actualizarProducto(id, producto);
      res.json(actualizado);
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  }

  async eliminarProducto(req, res) {
    try {
      const { id } = req.params;
      const result = await ServicesProductos.eliminarProducto(id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }

  async obtenerCategorias(req, res) {
    try {
      const categorias = await ServicesProductos.obtenerCategorias();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener categorías' });
    }
  }

  async obtenerMarcas(req, res) {
    try {
      const marcas = await ServicesProductos.obtenerMarcas();
      res.json(marcas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener marcas' });
    }
  }
}

module.exports = Productos