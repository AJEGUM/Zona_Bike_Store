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
      from: `"Zona Bike Store" <${process.env.EMAIL_USER}>`,
      to: usuario.email,
      subject: "Compra registrada con éxito",
      html
    });

    return true;
  }

  async enviarCorreoBienvenida(usuario) {
  // 1. Leer plantilla
  const templatePath = path.join(__dirname, "../templates/bienvenida.html");
  let html = fs.readFileSync(templatePath, "utf8");

  // 2. Reemplazar datos dinámicos
  html = html.replace("{{nombre}}", usuario.nombre);

  // 3. Enviar correo
  await transporter.sendMail({
    from: `"Zona Bike Store" <${process.env.EMAIL_USER}>`,
    to: usuario.email,
    subject: "¡Bienvenido a Bike Store!",
    html
  });

  return true;
}

async enviarCodigoRecuperacion(email, codigo) {
  const templatePath = path.join(__dirname, "../templates/recuperacion.html");
  let html = fs.readFileSync(templatePath, "utf8");

  html = html
    .replace("{{codigo}}", codigo)
    .replace("{{year}}", new Date().getFullYear());

  await transporter.sendMail({
    from: `"Zona Bike Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Código de recuperación",
    html
  });

  return true;
}

async enviarCorreoCambioClave(usuario) {

  // 1. Leer plantilla
  const templatePath = path.join(__dirname, "../templates/cambioClaveExitosa.html");
  let html = fs.readFileSync(templatePath, "utf8");

  // 2. Reemplazar datos dinámicos
  html = html
    .replace("{{nombre}}", usuario.nombre)
    .replace("{{year}}", new Date().getFullYear());

  // 3. Enviar correo
  await transporter.sendMail({
    from: `"Zona Bike Store" <${process.env.EMAIL_USER}>`,
    to: usuario.email,
    subject: "Tu contraseña ha sido actualizada",
    html
  });

  return true;
}


}

module.exports = new EmailService();
