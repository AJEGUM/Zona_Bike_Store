const db = require('../config/db');
const EmailService = require("./emails");
const axios = require('axios');

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
      email: usuario.email
    };
  }

  async obtenerDatosUsuario(idUsuario) {
    const [[usuario]] = await db.query(
      "SELECT nombre, email, telefono FROM usuarios WHERE id_usuario = ?",
      [idUsuario]
    );
    return usuario; // Ahora devuelve nombre, email y telefono
  }


  // 4️⃣ Función madre
async procesarPago(data, idUsuario) {
  const { items, total } = data;
  if (!items || items.length === 0) throw new Error("No se recibieron productos.");

  try {
    const idVenta = await this.crearVenta(idUsuario, total);
    await this.registrarDetalleYActualizarStock(idVenta, items);
    await this.registrarPago(idVenta, data);

    // Obtener datos completos (incluyendo el nuevo campo telefono)
    const usuario = await this.obtenerDatosUsuario(idUsuario);

    // Enviar correo (ya lo tenías)
    await EmailService.enviarCorreoCompra(usuario, items, total);

    // --- NUEVO: Enviar WhatsApp mediante n8n ---
    await this.enviarNotificacionN8N(usuario, items, total);

    return {
      mensaje: "Pago procesado correctamente. Correo y WhatsApp en camino.",
      id_venta: idVenta
    };

  } catch (error) {
    throw error;
  }
}

  // Funcion conectada con n8n
  async enviarNotificacionN8N(usuario, items, total) {
    try {
      // Usamos el nombre del servicio en Docker y el puerto 5678
      const N8N_URL = 'http://bikestore-n8n:5678/webhook-test/nueva-compra'; 
      
      // En tu función enviarNotificacionN8N, limpia el teléfono antes de enviarlo
      await axios.post(N8N_URL, {
        cliente: usuario.nombre,
        telefono: usuario.telefono.trim().replace(/\s/g, ''), // Esto quita espacios accidentales
        email: usuario.email,
        total: total,
        productos: items.length,
        tienda: "Zona Bike Store"
      });
      console.log("🚀 Notificación enviada a n8n");
    } catch (error) {
      console.error("❌ No se pudo avisar a n8n:", error.message);
      // No lanzamos el error (throw) para que la venta no se caiga si n8n falla
    }
  }



}

module.exports = new PagoService();
