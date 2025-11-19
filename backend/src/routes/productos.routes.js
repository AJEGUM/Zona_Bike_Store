const express = require('express');
const ProductosController = require('../controllers/productos.controller');
const router = express.Router();
const productosController = new ProductosController();

router.get('/categorias', (req, res) => productosController.obtenerCategorias(req, res));
router.get('/marcas', (req, res) => productosController.obtenerMarcas(req, res));
router.get('/', (req, res) => productosController.obtenerProductos(req, res));
router.post('/', (req, res) => productosController.crearProducto(req, res));
router.put('/:id', (req, res) => productosController.actualizarProducto(req, res));
router.delete('/:id', (req, res) => productosController.eliminarProducto(req, res));
router.get('/:id_producto/stock', (req, res) => productosController.obtenerStock(req, res));
router.put('/:id_producto/stock', (req, res) => productosController.actualizarStock(req, res));


module.exports = router;
