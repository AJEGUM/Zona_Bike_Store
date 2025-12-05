const RecuperacionService = require("../services/recuperacion");
const UsuariosController = require("./usuarios.controller");
const EmailService = require("../services/emails");
const usuariosController = new UsuariosController();
const bcrypt = require("bcrypt");

class RecuperacionController {

  async solicitarCodigo(req, res) {
    try {
      const { email } = req.body;
      const r = await RecuperacionService.solicitarCodigo(email);
      res.json(r);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  }

  async verificarCodigo(req, res) {
    try {
      const { email, codigo } = req.body;
      const r = await RecuperacionService.verificarCodigo(email, codigo);
      res.json(r);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  }

async restablecerClave(req, res) {
    try {
        const { email, nuevaClave } = req.body;

        const hashedClave = await bcrypt.hash(nuevaClave, 10);

        // Actualizar en la BD
        const r = await RecuperacionService.restablecerClave(email, hashedClave);

        // Obtener usuario para enviar correo
        const usuario = await usuariosController.obtenerUsuarioPorEmail(email);

        if (!usuario) {
            return res.status(400).json({ mensaje: "Usuario no encontrado para enviar correo." });
        }

        // Enviar correo de confirmación
        await EmailService.enviarCorreoCambioClave(usuario);

        res.json(r);

    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
}

}

module.exports = new RecuperacionController();
