// services/promociones.service.js
const db = require('../config/db');

class PromocionesService {

    async crearPromocion(data) {
        const { titulo, descripcion, fecha_inicio, fecha_fin, estado, id_usuario } = data;

        const [result] = await db.query(
            `INSERT INTO promociones (titulo, descripcion, fecha_inicio, fecha_fin, estado, id_usuario)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [titulo, descripcion, fecha_inicio, fecha_fin, estado, id_usuario]
        );

        return result.insertId;
    }

    async actualizarPromocion(id, data) {
        const { titulo, descripcion, fecha_inicio, fecha_fin, estado } = data;

        await db.query(
            `UPDATE promociones 
             SET titulo=?, descripcion=?, fecha_inicio=?, fecha_fin=?, estado=?
             WHERE id_promocion=?`,
            [titulo, descripcion, fecha_inicio, fecha_fin, estado, id]
        );

        return true;
    }

    async listarPromociones() {
        const [rows] = await db.query(`SELECT * FROM promociones`);
        return rows;
    }
}

module.exports = new PromocionesService();
