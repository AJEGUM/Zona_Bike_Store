// controllers/promociones.controller.js
const promocionesService = require('../services/promociones.services');
const imagenesController = require('./imagenes.controller');

class PromocionesController {

    async obtener(req, res) {
        try {
            const data = await promocionesService.obtenerPromociones();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: "Error al listar promociones" });
        }
    }

    async crear(req, res) {
        try {
            const promocion = req.body;

            const nueva = await promocionesService.crearPromocion(promocion);

            return res.status(201).json({ success: true, promocion: nueva });

        } catch (err) {
            return res.status(500).json({ error: 'Error al crear promoción' });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const body = req.body;

            const actualizada = await promocionesService.actualizarPromocion(id, body);
            res.json(actualizada);

        } catch (err) {
            res.status(500).json({ error: "Error al actualizar promoción" });
        }
    }

    // ⭐ SUBIR IMAGEN (igual que productos)
    async subirImagen(req, res) {
        try {
            const { id } = req.params;
            const { imagen } = req.body;

            const result = await imagenesController.guardarImagen(
                "promociones",
                "id_promocion",
                id,
                imagen
            );

            res.json({ success: true, result });

        } catch (error) {
            res.status(500).json({ error: "Error al subir imagen" });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const result = await promocionesService.eliminarPromocion(id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar promoción" });
        }
    }

}

module.exports = new PromocionesController();
