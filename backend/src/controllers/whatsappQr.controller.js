const qrService = require('../services/whatsappQrService');
const fs = require('fs-extra');
const path = require('path');

const logout = async (req, res) => {
    const { empresaId } = req.body;
    try {
        // 1. Si existe una sesión activa, cerrarla
        if (qrService.sessions[empresaId]) {
            await qrService.sessions[empresaId].logout();
            delete qrService.sessions[empresaId];
        }

        // 2. Borrar carpeta de sesión
        const sessionPath = path.join(__dirname, `../../sesiones/empresa_${empresaId}`);
        if (fs.existsSync(sessionPath)) {
            await fs.remove(sessionPath);
        }

        res.json({ status: 'success', message: "Sesión eliminada y desconectada" });
    } catch (error) {
        console.error("Error en logout QR:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { logout };