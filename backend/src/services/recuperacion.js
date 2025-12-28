const db = require("../config/db");
const EmailService = require("./emails");
const SmsService = require("../services/TwiloSMS");

class RecuperacionService {

  generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async solicitarCodigo(email) {
  // 1. Buscamos al usuario para obtener su ID, teléfono y validar que existe
  const [[usuario]] = await db.query(
    "SELECT id_usuario, telefono FROM usuarios WHERE email = ?",
    [email]
  );

  if (!usuario) {
    throw new Error("No existe una cuenta con este correo.");
  }

  const codigo = this.generarCodigo();
  const expiracion = new Date(Date.now() + 10 * 60000);

  // 2. CORRECCIÓN: Insertar usando 'id_usuario' en lugar de 'email'
  await db.query(
    `INSERT INTO recuperacion_clave (id_usuario, codigo, expiracion)
     VALUES (?, ?, ?)`,
    [usuario.id_usuario, codigo, expiracion] // Usamos el ID que sacamos de la tabla usuarios
  );

  // 3. Enviar por Correo
  await EmailService.enviarCodigoRecuperacion(email, codigo);

  // 4. Enviar por SMS si tiene teléfono
  if (usuario.telefono) {
    try {
      await SmsService.enviarSms(
        usuario.telefono, 
        `Tu codigo de recuperacion es: ${codigo}`
      );
    } catch (smsError) {
      console.error("Error al enviar SMS:", smsError.message);
    }
  }

  return { mensaje: "Código enviado con éxito" };
}

  async verificarCodigo(email, codigo) {
  // Buscamos el ID del usuario primero
  const [[usuario]] = await db.query("SELECT id_usuario FROM usuarios WHERE email = ?", [email]);
  
  if (!usuario) throw new Error("Usuario no encontrado.");

  // Buscamos el código usando el id_usuario
  const [[registro]] = await db.query(
    `SELECT * FROM recuperacion_clave 
     WHERE id_usuario = ? AND codigo = ? AND usado = 0
     ORDER BY id DESC LIMIT 1`,
    [usuario.id_usuario, codigo]
  );

  if (!registro) {
    throw new Error("Código incorrecto.");
  }

  if (new Date(registro.expiracion) < new Date()) {
    throw new Error("El código ha expirado.");
  }

  return { mensaje: "Código válido." };
}
}

module.exports = new RecuperacionService();
