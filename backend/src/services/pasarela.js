const db = require('../config/db');
const EmailService = require("./emails");

class PagoService {

  // 1️⃣ Crear venta
  async crearVenta(idUsuario, total) {
    const [venta] = await db.query(
      `INSERT INTO ventas (id_usuario, total) VALUES (?, ?)`,
      [idUsuario, total]
    );
    return venta.insertId;
  }

  // 2️⃣ Registrar detalle + actualizar stock
  async registrarDetalleYActualizarStock(idVenta, items) {
    for (const item of items) {
      const { id_producto, cantidad, precio_unitario } = item;

      const [stockBD] = await db.query(
        `SELECT cantidad FROM stock_productos WHERE id_producto = ?`,
        [id_producto]
      );

      const stockActual = stockBD[0].cantidad;

      if (stockActual < cantidad) {
        throw new Error(`Stock insuficiente para el producto ID ${id_producto}`);
      }

      await db.query(
        `INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [idVenta, id_producto, cantidad, precio_unitario]
      );

      await db.query(
        `UPDATE stock_productos SET cantidad = cantidad - ? WHERE id_producto = ?`,
        [cantidad, id_producto]
      );

      if (stockActual - cantidad <= 0) {
        await db.query(
          `UPDATE productos SET estado = 'inactivo' WHERE id_producto = ?`,
          [id_producto]
        );
      }
    }
  }

  // 3️⃣ Registrar pago en TABLA REAL
  async registrarPago(idVenta, data) {
    const {
      numero_tarjeta,
      fecha_expiracion,
      cvv,
      ciudad,
      pais
    } = data.pago;

    await db.query(
      `INSERT INTO pagos (id_venta, numero_tarjeta, fecha_expiracion, cvv, ciudad, pais)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        idVenta,
        numero_tarjeta,
        fecha_expiracion,
        cvv,
        ciudad,
        pais
      ]
    );
  }

  async obtenerCorreoUsuario(idUsuario) {
    const [[usuario]] = await db.query(
      "SELECT nombre, email FROM usuarios WHERE id_usuario = ?",
      [idUsuario]
    );

    if (!usuario || !usuario.email) {
      throw new Error("El usuario no tiene email registrado.");
    }

    return {
      nombre: usuario.nombre,
      correo: usuario.email
    };
  }


  // 4️⃣ Función madre
  async procesarPago(data, idUsuario) {
    const { items, total } = data;

    if (!items || items.length === 0) {
      throw new Error("No se recibieron productos.");
    }

    try {
      // Crear venta
      const idVenta = await this.crearVenta(idUsuario, total);

      // Registrar detalles
      await this.registrarDetalleYActualizarStock(idVenta, items);

      // Registrar pago
      await this.registrarPago(idVenta, data);

      // Obtener correo + nombre del usuario
      const usuario = await this.obtenerCorreoUsuario(idUsuario);

      // Enviar correo correctamente
      await EmailService.enviarCorreoCompra(usuario, items, total);

      return {
        mensaje: "Pago procesado correctamente. Correo enviado.",
        id_venta: idVenta
      };

    } catch (error) {
      throw error;
    }
  }



}

module.exports = new PagoService();
