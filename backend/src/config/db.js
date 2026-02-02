const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // --- CONFIGURACIÓN PARA SOPORTAR CARGA ---
  connectionLimit: 15,           // Máximo de conexiones simultáneas [cite: 2026-01-29]
  waitForConnections: true,      // Si el pool está lleno, espera en cola en lugar de dar error
  queueLimit: 0,                 // Sin límite de espera en cola
  connectTimeout: 10000,         // 10 segundos para intentar conectar

  supportBigNumbers: true,       // Manejar numeros enteros    
  bigNumberStrings: false,       // Numeros grandes como enteros
  decimalNumbers: true           // no altera valor decimal 
});

module.exports = db;