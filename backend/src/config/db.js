// // db.js - Simulación temporal en memoria
const sessions = {};

const db = {
    usuarios: {
        update: (data) => ({
            where: (query) => {
                const phone = query.phone;
                sessions[phone] = { ...sessions[phone], ...data };
                console.log(`[DB Mock] Usuario ${phone} actualizado a contexto: ${data.context}`);
            }
        }),
        get: (phone) => sessions[phone] || { context: null }
    }
};

// module.exports = db;

// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 30, // Importante para aguantar carga
  queueLimit: 0
});

module.exports = pool;