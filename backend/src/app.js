require('dotenv').config();
const express = require('express'); 
const cors = require('cors');       
const passport = require("./config/passport");

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json({ limit: '20mb' })); 
app.use(express.urlencoded({ extended: true, limit: '20mb' })); 
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('ok'); 
});

// Rutas Existentes
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

// Rutas de WhatsApp (Diferenciadas)
app.use('/api/whatsapp', require('./routes/whatsapp.routes'));    // Oficial (Meta)

module.exports = app;