const db = require('../config/db');
const bcrypt = require('bcrypt');
const EmailService = require('../services/emails');


class UsuariosController {
  // Obtener todos los usuarios con su rol
  async obtenerUsuarios(req, res) {
    try {
      const [usuarios] = await db.query(`
        SELECT u.id_usuario, u.nombre, u.email, r.nombre AS rol
        FROM usuarios u
        LEFT JOIN roles r ON u.id_rol = r.id_rol
      `);
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  // Agregar usuario
  async agregarUsuario(req, res) {
    const { nombre, email, clave, id_rol } = req.body;
    try {
      // 1️⃣ Encriptar la contraseña
      const hash = await bcrypt.hash(clave, 10);

      // 2️⃣ Insertar usuario en la DB
      const [result] = await db.query(
        'INSERT INTO usuarios (nombre, email, clave, id_rol) VALUES (?, ?, ?, ?)',
        [nombre, email, hash, id_rol]
      );

      // 3️⃣ Obtener el nombre del rol usando la función auxiliar
      const rolNombre = await this.obtenerNombreRol(id_rol);

      // 4️⃣ Construir objeto usuario
      const nuevoUsuario = {
        id_usuario: result.insertId,
        nombre,
        email,
        rol: rolNombre
      };

      // 5️⃣ Enviar correo de bienvenida
      try {
        await EmailService.enviarCorreoBienvenida(nuevoUsuario);
        console.log('Correo de bienvenida enviado a', email);
      } catch (err) {
        console.error('Error al enviar correo de bienvenida:', err.message);
      }

      // 6️⃣ Devolver usuario registrado
      res.json(nuevoUsuario);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al agregar usuario' });
    }
  }


  async editarUsuario(req, res) {
    const { id } = req.params;
    const { nombre, email, clave, id_rol } = req.body;

    try {
      let hash = null;

      // Si enviaron contraseña nueva → se encripta
      if (clave) {
        hash = await bcrypt.hash(clave, 10);
      }

      await db.query(`
        UPDATE usuarios 
        SET nombre=?, email=?, id_rol=?, clave = COALESCE(?, clave)
        WHERE id_usuario=?
      `, [nombre, email, id_rol, hash, id]);

      const rol = await this.obtenerNombreRol(id_rol);

      res.json({
        id_usuario: Number(id),
        nombre,
        email,
        rol
      });

    } catch (error) {
      res.status(500).json({ error: 'Error al editar usuario' });
    }
  }


  // Función auxiliar para obtener nombre de rol
  async obtenerNombreRol(id_rol) {
    try {
      const [rows] = await db.query('SELECT nombre FROM roles WHERE id_rol = ?', [id_rol]);
      return rows.length ? rows[0].nombre : '';
    } catch (error) {
      return '';
    }
  }

  // Eliminar usuario
  async eliminarUsuario(req, res) {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }

  // Obtener roles
  async obtenerRoles(req, res) {
    try {
      const [roles] = await db.query('SELECT id_rol, nombre FROM roles');
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener roles' });
    }
  }
}

module.exports = UsuariosController;
