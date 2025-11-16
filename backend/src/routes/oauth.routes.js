const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Iniciar login con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback de Google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id_usuario,
        nombre: req.user.nombre,
        email: req.user.email,
        rol: req.user.rol_nombre, 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Redirige al frontend con el token
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);
  }
);

module.exports = router;
