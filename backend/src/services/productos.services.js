const db = require('../config/db');

class ServicesSeguimientos {
  async obtenerProductosServices() {
    const [rows] = await db.query(
      `
      SELECT 
        p.id_producto,
        p.nombre AS producto,
        c.nombre AS categoria,
        p.precio_venta AS precio,
        p.estado
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria;

      `
    );
    return rows;
  }

}

module.exports = new ServicesSeguimientos();
