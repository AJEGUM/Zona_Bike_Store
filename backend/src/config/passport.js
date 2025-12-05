const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../config/db");
const EmailService = require("../services/emails");
const jwt = require('jsonwebtoken');

require("dotenv").config();

// Función que verifica o crea y retorna usuario con rol incluido
async function findOrCreateUser(nombre, email) {
  let esNuevo = false;

  // Buscar usuario con JOIN para traer rol_nombre
  const [rows] = await db.query(
    `SELECT u.*, r.nombre AS rol_nombre
     FROM usuarios u
     JOIN roles r ON u.id_rol = r.id_rol
     WHERE u.email = ?`,
    [email]
  );

  if (rows.length > 0) {
    return { user: rows[0], esNuevo };
  }

  // Crear usuario nuevo (rol cliente = 2)
  const [result] = await db.query(
    "INSERT INTO usuarios (nombre, email, clave, id_rol) VALUES (?, ?, ?, ?)",
    [nombre, email, null, 2]
  );

  esNuevo = true;

  // Volver a consultar con JOIN
  const [nuevo] = await db.query(
    `SELECT u.*, r.nombre AS rol_nombre
     FROM usuarios u
     JOIN roles r ON u.id_rol = r.id_rol
     WHERE u.id_usuario = ?`,
    [result.insertId]
  );

  return { user: nuevo[0], esNuevo };
}


// Configuración de Google OAuth2
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const nombre = profile.displayName;
        const email = profile.emails[0].value;

        const { user, esNuevo } = await findOrCreateUser(nombre, email);

        if (esNuevo) {
          await EmailService.enviarCorreoBienvenida(user);
        }

        // 🔹 Generamos el token aquí y lo devolvemos directamente
        const token = jwt.sign(
          {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            rol: user.rol_nombre
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        // Devolver solo el token, no un objeto con user
        return done(null, { token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);


module.exports = passport;
