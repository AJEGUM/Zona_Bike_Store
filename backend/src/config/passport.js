const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../config/db");

require("dotenv").config();

// Función que verifica o crea y retorna usuario con rol incluido
async function findOrCreateUser(nombre, email) {

  // Buscar usuario con JOIN para traer rol_nombre
  const [rows] = await db.query(
    `SELECT u.*, r.nombre AS rol_nombre
     FROM usuarios u
     JOIN roles r ON u.id_rol = r.id_rol
     WHERE u.email = ?`,
    [email]
  );

  if (rows.length > 0) {
    return rows[0];
  }

  // Crear usuario nuevo (rol cliente = 2)
  const [result] = await db.query(
    "INSERT INTO usuarios (nombre, email, clave, id_rol) VALUES (?, ?, ?, ?)",
    [nombre, email, null, 2]
  );

  // Volver a consultar con JOIN
  const [nuevo] = await db.query(
    `SELECT u.*, r.nombre AS rol_nombre
     FROM usuarios u
     JOIN roles r ON u.id_rol = r.id_rol
     WHERE u.id_usuario = ?`,
    [result.insertId]
  );

  return nuevo[0];
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

        const user = await findOrCreateUser(nombre, email);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
