const db = require("../config/db");
const EmailService = require("./emails");

class RecuperacionService {

  generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async solicitarCodigo(email) {
    // Verificar que exista el usuario
    const [[usuario]] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (!usuario) {
      throw new Error("No existe una cuenta con este correo.");
    }

    const codigo = this.generarCodigo();
    const expiracion = new Date(Date.now() + 10 * 60000); // Expira en 10 mins

    // Guardar código
    await db.query(
      `INSERT INTO recuperacion_clave (email, codigo, expiracion)
       VALUES (?, ?, ?)`,
      [email, codigo, expiracion]
    );

    // Enviar correo
    await EmailService.enviarCodigoRecuperacion(email, codigo);

    return { mensaje: "Código enviado al correo" };
  }

  async verificarCodigo(email, codigo) {
    const [[registro]] = await db.query(
      `SELECT * FROM recuperacion_clave 
       WHERE email = ? AND codigo = ? AND usado = 0
       ORDER BY id DESC LIMIT 1`,
      [email, codigo]
    );

    if (!registro) {
      throw new Error("Código incorrecto.");
    }

    if (new Date(registro.expiracion) < new Date()) {
      throw new Error("El código ha expirado.");
    }

    return { mensaje: "Código válido." };
  }

    async restablecerClave(email, hashedClave) {

    // Actualizar clave del usuario
    await db.query(
        "UPDATE usuarios SET clave = ? WHERE email = ?",
        [hashedClave, email]
    );

    // Marcar códigos como usados
    await db.query(
        "UPDATE recuperacion_clave SET usado = 1 WHERE email = ?",
        [email]
    );

    return { mensaje: "Contraseña actualizada correctamente." };
    }

}

module.exports = new RecuperacionService();
