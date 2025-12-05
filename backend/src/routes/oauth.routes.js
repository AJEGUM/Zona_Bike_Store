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
    const token = req.user.token; // ahora sí existe
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);
  }
);


module.exports = router;
