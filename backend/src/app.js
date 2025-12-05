require('dotenv').config();
const express = require('express'); // Framework Express para la creación del servidor
const cors = require('cors');       // Permite solicitudes de otros dominios
const passport = require("./config/passport");

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json({ limit: '20mb' })); // Recibe datos en formato JSON con límite
app.use(express.urlencoded({ extended: true, limit: '20mb' })); // Recibe datos codificados
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('ok'); // Ruta que verifica si esta funcionando el servidor en el navegador
});

// Rutas
app.use('/api/auth', require('./routes/oauth.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/estadisticas', require('./routes/estadisticas.routes'));
app.use('/api/imagenes', require('./routes/imagen.routes'));
app.use('/api/pagos', require('./routes/pasarela.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use("/api/categorias", require("./routes/categorias.routes"));
app.use("/api/marcas", require("./routes/marcas.routes"));
app.use("/api/promociones", require("./routes/promociones.routes"));
app.use('/api/roles', require('./routes/roles.routes'));
app.use("/api/recuperacion", require("./routes/recuperacion.routes"));
app.use('/api/usuarios', require('./routes/usuarios.routes'));

module.exports = app;