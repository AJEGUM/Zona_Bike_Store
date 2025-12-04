const db = require("../config/db");

class MarcasService {

  async obtenerMarcas() {
    const [rows] = await db.query("SELECT * FROM marcas ORDER BY nombre ASC");
    return rows;
  }

  async obtenerMarca(id) {
    const [rows] = await db.query("SELECT * FROM marcas WHERE id_marca = ?", [id]);
    return rows[0];
  }

  async crearMarca(nombre) {
    const query = "INSERT INTO marcas (nombre) VALUES (?)";
    const [result] = await db.query(query, [nombre]);
    return { id_marca: result.insertId, nombre };
  }

  async actualizarMarca(id, nombre) {
    const query = "UPDATE marcas SET nombre = ? WHERE id_marca = ?";
    await db.query(query, [nombre, id]);
    return { id_marca: id, nombre };
  }

  async eliminarMarca(id) {
    try {
      await db.query("DELETE FROM marcas WHERE id_marca = ?", [id]);
      return true;

    } catch (error) {

      // Si MySQL detecta una relación con productos
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        const err = new Error("No se puede eliminar la marca porque está asociada a productos.");
        err.status = 400;
        throw err;
      }

      // Error general
      const err = new Error("Error al eliminar la marca.");
      err.status = 500;
      throw err;
    }
  }

}

module.exports = new MarcasService();
