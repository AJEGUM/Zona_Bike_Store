const db = require("../config/db");

class StatsService {
  
  // 1️⃣ Productos más vendidos
  async obtenerProductosMasVendidos(limit = 10) {
    const [rows] = await db.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        SUM(dv.cantidad) AS total_vendidos
      FROM detalle_ventas dv
      INNER JOIN productos p ON dv.id_producto = p.id_producto
      GROUP BY p.id_producto, p.nombre
      ORDER BY total_vendidos DESC
      LIMIT ?
    `, [limit]);

    return rows;
  }

  // 2️⃣ Ventas por periodo
  async obtenerVentasPorPeriodo(inicio, fin) {
    const [rows] = await db.query(`
      SELECT 
        DATE(fecha_venta) AS fecha,
        COUNT(*) AS total_ventas
      FROM ventas
      WHERE DATE(fecha_venta) BETWEEN ? AND ?
      GROUP BY DATE(fecha_venta)
      ORDER BY fecha ASC
    `, [inicio, fin]);

    return rows;
  }

  async obtenerVentasPorCategoriaMes(mes, anio, idCategoria) {
    const [rows] = await db.query(`
      SELECT 
          v.fecha_venta AS fecha,
          p.nombre AS producto,
          dv.cantidad AS cantidad,
          dv.precio_unitario AS precio_unitario,
          (dv.cantidad * dv.precio_unitario) AS total
      FROM detalle_ventas dv
      INNER JOIN ventas v ON dv.id_venta = v.id_venta
      INNER JOIN productos p ON dv.id_producto = p.id_producto
      WHERE p.id_categoria = ?
        AND MONTH(v.fecha_venta) = ?
        AND YEAR(v.fecha_venta) = ?
      ORDER BY v.fecha_venta;
    `, [idCategoria, mes, anio]);

    return rows;
  }



  // 3️⃣ Función madre si algún día quieres un dashboard grande
  async obtenerDashboardCompleto(inicio, fin) {
    return {
      masVendidos: await this.obtenerProductosMasVendidos(),
      ventasPeriodo: await this.obtenerVentasPorPeriodo(inicio, fin)
    };
  }

}

module.exports = new StatsService();
