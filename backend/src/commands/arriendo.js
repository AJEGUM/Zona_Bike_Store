const db = require('../config/db');

module.exports = {
    keys: ['btn_arriendo', 'arriendo', '1'],
    async execute(from, whatsappService) {
        // 1. Guardamos estado
        db.usuarios.update({ context: 'esperando_zona' }).where({ phone: from });

        // 2. Definimos sub-menú
        const botonesZonas = [
            { id: 'zona_norte', title: 'Norte 🧭' },
            { id: 'zona_sur', title: 'Sur 📍' },
            { id: 'btn_volver', title: 'Volver ↩️' }
        ];
        
        // AHORA SÍ: Esta función ya existe en el service
        await whatsappService.sendButtons(from, "🏢 ¿En qué zona buscas arriendo?", botonesZonas);
    }
};