const db = require('../config/db');
const bcrypt = require('bcrypt');

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
      console.error(error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  }

  // Agregar usuario
  async agregarUsuario(req, res) {
    const { nombre, email, clave, id_rol } = req.body;
    try {
      const hash = await bcrypt.hash(clave, 10);

      const [result] = await db.query(
        'INSERT INTO usuarios (nombre, email, clave, id_rol) VALUES (?, ?, ?, ?)',
        [nombre, email, hash, id_rol]
      );

      // Obtener el nombre del rol
      const rolNombre = await this.obtenerNombreRol(id_rol);

      const nuevoUsuario = {
        id_usuario: result.insertId,
        nombre,
        email,
        rol: rolNombre
      };

      res.json(nuevoUsuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al agregar usuario' });
    }
  }

  // Función auxiliar para obtener nombre de rol
  async obtenerNombreRol(id_rol) {
    try {
      const [rows] = await db.query('SELECT nombre FROM roles WHERE id_rol = ?', [id_rol]);
      return rows.length ? rows[0].nombre : '';
    } catch (error) {
      console.error('Error al obtener nombre del rol:', error);
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
      console.error(error);
      res.status(500).json({ error: 'Error al obtener roles' });
    }
  }
}

module.exports = UsuariosController;
