const ServicesProductos = require("../services/productos.services");

class Productos{

    async obtenerProductosController(req, res) {
        try {
            const productos = await ServicesProductos.obtenerProductosServices();
            res.json(productos);

        } catch (error) {
            console.error("Error en productos controller:", error);
            res.status(500).json({ error: "Error al obtener productos" });
        }
    }
}

module.exports = Productos