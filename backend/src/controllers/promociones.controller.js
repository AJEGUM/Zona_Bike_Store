// controllers/promociones.controller.js
const promocionesService = require('../services/promociones.services');
const imagenesController = require('./imagenes.controller');

class PromocionesController {

    async crear(req, res) {
        try {
            const id = await promocionesService.crearPromocion(req.body);
            res.json({ message: "Promoción creada", id_promocion: id });
        } catch (err) {
            res.status(500).json({ error: "Error al crear promoción" });
        }
    }

    async actualizar(req, res) {
        try {
            await promocionesService.actualizarPromocion(req.params.id, req.body);
            res.json({ message: "Promoción actualizada" });
        } catch (err) {
            res.status(500).json({ error: "Error al actualizar" });
        }
    }

    async listar(req, res) {
        try {
            const data = await promocionesService.listarPromociones();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: "Error al listar promociones" });
        }
    }

    // Subir imagen desde aquí mismo
    async subirImagen(req, res) {
        try {
            const { id } = req.params;
            const imagen = req.body.imagen;

            const result = await imagenesController.guardarImagen(
                "promociones",
                "id_promocion",
                id,
                imagen
            );

            res.json(result);
        } catch (err) {
            res.status(500).json({ error: "Error al subir imagen" });
        }
    }
}

module.exports = new PromocionesController();
