const db = require('../config/db');

class ServicesProductos {

  async obtenerProductos() {
    const [rows] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.precio_venta,
        CONCAT('$', FORMAT(p.precio_venta, 0, 'es_CO')) AS precio_venta_formateado,
        p.descripcion,
        p.imagen,
        p.estado,

        COALESCE(s.cantidad, 0) AS stock,

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
      LEFT JOIN stock_productos s ON p.id_producto = s.id_producto
    `);

    return rows;
  }



async crearProducto(producto) {
  const { nombre, precio_venta, id_categoria, id_marca, estado = 'activo', descripcion = '', imagen = '', stock = 0 } = producto;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Crear producto
    const [result] = await conn.query(`
      INSERT INTO productos (nombre, precio_venta, descripcion, imagen, id_categoria, id_marca, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [nombre, precio_venta, descripcion, imagen, id_categoria, id_marca, estado]);

    const id_producto = result.insertId;

    // 2. Crear stock
    await conn.query(`
      INSERT INTO stock_productos (id_producto, cantidad)
      VALUES (?, ?)
    `, [id_producto, stock]);

    // 3. Obtener producto completo
    const [[nuevo]] = await conn.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.precio_venta,
        p.descripcion,
        p.imagen,
        p.estado,
        COALESCE(s.cantidad, 0) AS stock,

        JSON_OBJECT('id_categoria', c.id_categoria, 'nombre', c.nombre) AS categoria,
        JSON_OBJECT('id_marca', m.id_marca, 'nombre', m.nombre) AS marca

      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      INNER JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN stock_productos s ON p.id_producto = s.id_producto
      WHERE p.id_producto = ?
    `, [id_producto]);

    await conn.commit();
    return nuevo;

  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}


 async actualizarProducto(id_producto, producto) {
  const { nombre, precio_venta, descripcion = '', imagen = '', id_categoria, id_marca, estado, stock } = producto;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(`
      UPDATE productos
      SET nombre=?, precio_venta=?, descripcion=?, imagen=?, id_categoria=?, id_marca=?, estado=?
      WHERE id_producto=?
    `, [nombre, precio_venta, descripcion, imagen, id_categoria, id_marca, estado, id_producto]);

    if (stock !== undefined) {
      await conn.query(`
        UPDATE stock_productos SET cantidad=? WHERE id_producto=?
      `, [stock, id_producto]);
    }

    // devolver datos completos
    const [[actualizado]] = await conn.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.precio_venta,
        p.descripcion,
        p.imagen,
        p.estado,
        COALESCE(s.cantidad, 0) AS stock,

        JSON_OBJECT('id_categoria', c.id_categoria, 'nombre', c.nombre) AS categoria,
        JSON_OBJECT('id_marca', m.id_marca, 'nombre', m.nombre) AS marca

      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      INNER JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN stock_productos s ON p.id_producto = s.id_producto
      WHERE p.id_producto = ?
    `, [id_producto]);

    await conn.commit();
    return actualizado;

  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}



 async eliminarProducto(id_producto) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(`DELETE FROM stock_productos WHERE id_producto=?`, [id_producto]);
    await conn.query(`DELETE FROM productos WHERE id_producto=?`, [id_producto]);

    await conn.commit();
    return { mensaje: 'Producto eliminado correctamente' };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
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
      throw error;
    }
  }
  
async obtenerStock(id_producto) {
  const [[row]] = await db.query(`
    SELECT cantidad
    FROM stock_productos
    WHERE id_producto = ?
  `, [id_producto]);

  return row || { cantidad: 0 };
}

async actualizarStock(id_producto, cantidad) {
  await db.query(`
    UPDATE stock_productos SET cantidad = ?
    WHERE id_producto = ?
  `, [cantidad, id_producto]);

  return { mensaje: "Stock actualizado correctamente", cantidad };
}


}

module.exports = new ServicesProductos()
