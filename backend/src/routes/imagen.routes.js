const express = require("express");
const router = express.Router();
const imagenesController = require('../controllers/imagenes.controller');

router.post('/guardar/:tabla/:campoId/:id', async (req, res) => {
    try {
        const { tabla, campoId, id } = req.params;
        const imagenBase64 = req.body.imagen;

        if (!imagenBase64) {
            return res.status(400).json({ error: "Se requiere imagen en base64" });
        }

        const resultado = await imagenesController.guardarImagen(tabla, campoId, id, imagenBase64);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: "Error al guardar imagen" });
    }
});

router.get('/obtener/:tabla/:campoId/:id', async (req, res) => {
    try {
        const { tabla, campoId, id } = req.params;
        const resultado = await imagenesController.obtenerImagen(tabla, campoId, id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener imagen" });
    }
});

router.delete('/eliminar/:tabla/:campoId/:id', async (req, res) => {
    try {
        const { tabla, campoId, id } = req.params;
        const resultado = await imagenesController.eliminarImagen(tabla, campoId, id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar imagen" });
    }
});

module.exports = router;
