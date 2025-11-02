const db = require('../config/db');

class ServicesProductos {

  async obtenerProductos() {
    const [rows] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre AS producto,
        c.nombre AS categoria,
        m.nombre AS marca,
        p.precio_venta AS precio,
        p.descripcion,
        p.imagen,
        p.estado
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      INNER JOIN marcas m ON p.id_marca = m.id_marca
    `);
    return rows;
  }

  async crearProducto(producto) {
    const { nombre, precio_venta, id_categoria, id_marca, estado = 'activo' } = producto;
    const [result] = await db.query(`
      INSERT INTO productos (nombre, precio_venta, id_categoria, id_marca, estado)
      VALUES (?, ?, ?, ?, ?)
    `, [nombre, precio_venta, id_categoria, id_marca, estado]);

    // Solo devolvemos lo necesario para la tabla
    return {
      id_producto: result.insertId,
      producto: nombre,
      categoria: await this.obtenerCategorias(id_categoria),
      marca: await this.obtenerMarcas(id_marca),
      precio: precio_venta,
      estado
    };
  }

  async actualizarProducto(id_producto, producto) {
    const { nombre, precio_venta, id_categoria, id_marca, estado } = producto;
    await db.query(`
      UPDATE productos
      SET nombre=?, precio_venta=?, id_categoria=?, id_marca=?, estado=?
      WHERE id_producto=?
    `, [nombre, precio_venta, id_categoria, id_marca, estado, id_producto]);

    return {
      id_producto,
      producto: nombre,
      categoria: await this.obtenerCategorias(id_categoria),
      marca: await this.obtenerMarcas(id_marca),
      precio: precio_venta,
      estado
    };
  }

  async eliminarProducto(id_producto) {
    await db.query(`DELETE FROM productos WHERE id_producto = ?`, [id_producto]);
    return { mensaje: 'Producto eliminado correctamente' };
  }

  async obtenerCategorias() {
    try {
      const [rows] = await db.query(`
        SELECT id_categoria, nombre
        FROM categorias
        ORDER BY nombre ASC
      `);
      return rows;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  async obtenerMarcas() {
    try {
      const [rows] = await db.query(`
        SELECT id_marca, nombre
        FROM marcas
        ORDER BY nombre ASC
      `);
      return rows;
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  }
}

module.exports = new ServicesProductos()
