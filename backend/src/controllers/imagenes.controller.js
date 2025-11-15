// Conexión
const db = require('../config/db');

class ImagenesController {

    // Insertar o actualizar imagen base64
    async guardarImagen(tabla, campoId, id, imagenBase64) {
        try {
            // Verificar si el registro existe
            const [registro] = await db.query(
                `SELECT * FROM ?? WHERE ?? = ?`,
                [tabla, campoId, id]
            );

            if (registro.length === 0) {
                return { error: "No se encontró el registro con el ID proporcionado" };
            }

            // Guardar base64 directamente en LONGTEXT
            const query = `UPDATE ?? SET imagen = ? WHERE ?? = ?`;
            const [result] = await db.query(query, [
                tabla,
                imagenBase64, // ✅ Base64 crudo, nada de Buffer
                campoId,
                id
            ]);

            return {
                message: result.affectedRows > 0
                    ? "Imagen guardada correctamente"
                    : "Error al guardar la imagen"
            };

        } catch (error) {
            throw error;
        }
    }

    // Obtener imagen base64
    async obtenerImagen(tabla, campoId, id) {
        try {
            const [rows] = await db.query(
                `SELECT imagen FROM ?? WHERE ?? = ?`,
                [tabla, campoId, id]
            );

            if (rows.length === 0) return { error: "Registro no encontrado" };
            if (!rows[0].imagen) return { error: "No hay imagen asociada" };

            return { imagen: rows[0].imagen }; // ✅ base64 directo

        } catch (error) {
            throw error;
        }
    }

    // Eliminar imagen (poner NULL)
    async eliminarImagen(tabla, campoId, id) {
        try {
            const query = `UPDATE ?? SET imagen = NULL WHERE ?? = ?`;
            const [result] = await db.query(query, [tabla, campoId, id]);

            return {
                message: result.affectedRows > 0
                    ? "Imagen eliminada"
                    : "Error al eliminar"
            };

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ImagenesController();
