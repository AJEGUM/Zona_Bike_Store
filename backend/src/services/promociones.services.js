// services/promociones.services.js
const db = require('../config/db');

class PromocionesService {

    limpiarFecha(fecha) {
        return fecha ? fecha.split("T")[0] : null;
    }

    async obtenerPromociones() {
        const [rows] = await db.query(`
            SELECT *
            FROM promociones
            ORDER BY fecha_inicio DESC
        `);

        return rows;
    }

    async crearPromocion(data) {
        const {
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            estado,
            id_usuario,
            posicion_texto,
            imagen
        } = data;

        const fechaInicioLimpia = this.limpiarFecha(fecha_inicio);
        const fechaFinLimpia = this.limpiarFecha(fecha_fin);

        const [result] = await db.query(`
            INSERT INTO promociones
            (titulo, descripcion, fecha_inicio, fecha_fin, estado, id_usuario, posicion_texto, imagen)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            titulo,
            descripcion,
            fechaInicioLimpia,
            fechaFinLimpia,
            estado,
            id_usuario,
            posicion_texto,
            imagen
        ]);

        const [[nueva]] = await db.query(`
            SELECT *
            FROM promociones
            WHERE id_promocion = ?
        `, [result.insertId]);

        return nueva;
    }

    async actualizarPromocion(id, data) {
        const {
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            estado,
            id_usuario,
            posicion_texto,
            imagen
        } = data;

        const fechaInicioLimpia = this.limpiarFecha(fecha_inicio);
        const fechaFinLimpia = this.limpiarFecha(fecha_fin);

        await db.query(`
            UPDATE promociones
            SET titulo=?, descripcion=?, fecha_inicio=?, fecha_fin=?, estado=?, id_usuario=?, posicion_texto=?, imagen=?
            WHERE id_promocion=?
        `, [
            titulo,
            descripcion,
            fechaInicioLimpia,
            fechaFinLimpia,
            estado,
            id_usuario,
            posicion_texto,
            imagen,
            id
        ]);

        const [[actualizada]] = await db.query(`
            SELECT *
            FROM promociones
            WHERE id_promocion = ?
        `, [id]);

        return actualizada;
    }

    async eliminarPromocion(id) {
        await db.query(`DELETE FROM promociones WHERE id_promocion = ?`, [id]);
    }

}

module.exports = new PromocionesService();
