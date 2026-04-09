// db.js - Simulación temporal en memoria
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

module.exports = db;