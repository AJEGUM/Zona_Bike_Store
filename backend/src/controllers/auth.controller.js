const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthController {
async login(req, res) {
  try {

    const { email, clave } = req.body;

    if (!email || !clave) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const [rows] = await db.query(
      `SELECT u.*, r.nombre AS rol_nombre
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.email = ?`,
      [email]
    );

    const usuario = rows[0];

    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }


    if (!usuario.clave) {
      return res.status(500).json({ message: "Hash inválido en BD" });
    }

    const esCorrecta = await bcrypt.compare(clave, usuario.clave);

    if (!esCorrecta) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol_nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token });

  } catch (error) {
    return res.status(500).json({ message: "Error interno" });
  }
}

}

module.exports = new AuthController();
