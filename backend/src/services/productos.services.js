const db = require('../config/db');

class ServicesProductos {

  async obtenerProductos() {
    const [rows] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.precio_venta,
        p.descripcion,
        p.imagen,
        p.estado,
        
        JSON_OBJECT(
          'id_categoria', c.id_categoria,
          'nombre', c.nombre
        ) AS categoria,

        JSON_OBJECT(
          'id_marca', m.id_marca,
          'nombre', m.nombre
        ) AS marca

      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      INNER JOIN marcas m ON p.id_marca = m.id_marca
    `);

    return rows;
  }

  async crearProducto(producto) {
    const { nombre, precio_venta, id_categoria, id_marca, estado = 'activo', descripcion = '', imagen = '' } = producto;

    const [result] = await db.query(`
      INSERT INTO productos (nombre, precio_venta, descripcion, imagen, id_categoria, id_marca, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [nombre, precio_venta, descripcion, imagen, id_categoria, id_marca, estado]);

    // Obtener datos completos como obtenerProductos()
    const [[nuevo]] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.precio_venta,
        p.descripcion,
        p.imagen,
        p.estado,
        
        JSON_OBJECT(
          'id_categoria', c.id_categoria,
          'nombre', c.nombre
        ) AS categoria,

        JSON_OBJECT(
          'id_marca', m.id_marca,
          'nombre', m.nombre
        ) AS marca

      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      INNER JOIN marcas m ON p.id_marca = m.id_marca
      WHERE p.id_producto = ?
    `, [result.insertId]);

    return nuevo;
  }

  async actualizarProducto(id_producto, producto) {
    const { nombre, precio_venta, descripcion = '', imagen = '', id_categoria, id_marca, estado } = producto;

    // Update
    await db.query(`
      UPDATE productos
      SET nombre=?, precio_venta=?, descripcion=?, imagen=?, id_categoria=?, id_marca=?, estado=?
      WHERE id_producto=?
    `, [nombre, precio_venta, descripcion, imagen, id_categoria, id_marca, estado, id_producto]);

    // Return full product (same structure as obtenerProductos)
    const [[actualizado]] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.precio_venta,
        p.descripcion,
        p.imagen,
        p.estado,
        
        JSON_OBJECT(
          'id_categoria', c.id_categoria,
          'nombre', c.nombre
        ) AS categoria,

        JSON_OBJECT(
          'id_marca', m.id_marca,
          'nombre', m.nombre
        ) AS marca

      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      INNER JOIN marcas m ON p.id_marca = m.id_marca
      WHERE p.id_producto = ?
    `, [id_producto]);

    return actualizado;
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
