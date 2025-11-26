const fs = require("fs");
const path = require("path");
const transporter = require("../config/mailer");

class EmailService {

  async enviarCorreoCompra(usuario, items, total) {

    // 1. Leer plantilla
    const templatePath = path.join(__dirname, "../templates/compraExitosa.html");
    let html = fs.readFileSync(templatePath, "utf8");

    // 2. Reemplazar datos dinámicos
    const itemsHtml = items.map(i =>
      `<li>${i.nombre_producto} - ${i.cantidad} x $${i.precio_unitario}</li>`
    ).join("");

    html = html
      .replace("{{nombre}}", usuario.nombre)
      .replace("{{items}}", itemsHtml)
      .replace("{{total}}", total);

    // 3. Enviar correo
    await transporter.sendMail({
      from: `"Bike Store" <${process.env.EMAIL_USER}>`,
      to: usuario.correo,
      subject: "Compra registrada con éxito",
      html
    });

    return true;
  }
}

module.exports = new EmailService();
