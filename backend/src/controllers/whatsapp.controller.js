const commands = require('../commands');
const whatsappService = require('../services/whatsapp.services');

const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    // Usa el token que configuraste en el panel de Meta
    const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'el_que_tu_inventes';
    
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log("¡Webhook verificado exitosamente!");
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403); // Token incorrecto
        }
    }
    return res.sendStatus(400);
};

const receiveMessage = async (req, res) => {
    try {
        const entry = req.body.entry?.[0];
        const message = entry?.changes?.[0]?.value?.messages?.[0];

        if (message) {
            const from = message.from;
            let text = "";

            // Normalización de la entrada
            if (message.type === 'text') {
                text = message.text.body.toLowerCase().trim();
            } else if (message.type === 'interactive') {
                text = message.interactive.button_reply.id;
            }

            // BUSCADOR DE COMANDOS: Busca qué comando tiene la "key" que envió el usuario
            const command = commands.find(c => c.keys.includes(text));

            if (command) {
                await command.execute(from, whatsappService);
            } else {
                // Si no encuentra el comando, envía el menú principal (Punto 2 de la propuesta)
                await whatsappService.sendMenuButtons(from);
            }
        }
        
        res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
        console.error("Error en receiveMessage:", error);
        res.sendStatus(500);
    }
};

module.exports = { verifyWebhook, receiveMessage };