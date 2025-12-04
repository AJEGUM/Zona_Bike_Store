const db = require("../config/db");

class CategoriasService {

  async obtenerCategorias() {
    const [rows] = await db.query("SELECT * FROM categorias ORDER BY nombre ASC");
    return rows;
  }

  async obtenerCategoria(id) {
    const [rows] = await db.query("SELECT * FROM categorias WHERE id_categoria = ?", [id]);
    return rows[0];
  }

  async crearCategoria(nombre) {
    const query = "INSERT INTO categorias (nombre) VALUES (?)";
    const [result] = await db.query(query, [nombre]);
    return { id_categoria: result.insertId, nombre };
  }

  async actualizarCategoria(id, nombre) {
    const query = "UPDATE categorias SET nombre = ? WHERE id_categoria = ?";
    await db.query(query, [nombre, id]);
    return { id_categoria: id, nombre };
  }

async eliminarCategoria(id) {
  try {
    await db.query("DELETE FROM categorias WHERE id_categoria = ?", [id]);
    return true;

  } catch (error) {

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      const err = new Error("No se puede eliminar la categoría porque está asociada a productos.");
      err.status = 400;
      throw err;
    }

    const err = new Error("Error al eliminar la categoría.");
    err.status = 500;
    throw err;
  }
}

}

module.exports = new CategoriasService();
