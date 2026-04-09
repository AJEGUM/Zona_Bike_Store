const axios = require('axios');

class WhatsAppService {
    async sendMessage(to, body) {
        try {
            const response = await axios.post(
                `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: to,
                    type: "text",
                    text: { body: body }
                },
                { headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` } }
            );
            return response.data;
        } catch (error) {
            console.error("Error en Service:", error.response.data);
            throw error;
        }
    }
    
    async sendMenuButtons(to) {
    try {
        await axios.post(
            `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: "¡Hola! Bienvenido a *Grupo 360* 🏢\n\nSelecciona una opción:" },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_arriendo", title: "Ver Arriendos 🏠" } },
                            { type: "reply", reply: { id: "btn_mapa", title: "Ver Mapa 📍" } }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` } }
        );
    } catch (error) {
        console.error("Error enviando botones:", error.response.data);
    }
}

    // Aquí podrías meter tu lógica de SQL más adelante
    async getCasasDisponibles() {
        // SELECT * FROM propiedades...
        return "Casa en Palmira - $1.200.000 - 3 Habitaciones";
    }

    async sendButtons(to, textBody, buttons) {
        try {
            await axios.post(
                `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: to,
                    type: "interactive",
                    interactive: {
                        type: "button",
                        body: { text: textBody },
                        action: {
                            // Mapeamos el array de botones que envíes
                            buttons: buttons.map(btn => ({
                                type: "reply",
                                reply: { id: btn.id, title: btn.title }
                            }))
                        }
                    }
                },
                { headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` } }
            );
        } catch (error) {
            console.error("Error enviando botones:", error.response?.data || error.message);
        }
    }

    async sendMenuButtons(to) {
        // Este lo dejamos como el menú de bienvenida fijo
        const principal = [
            { id: "btn_arriendo", title: "Ver Arriendos 🏠" },
            { id: "btn_mapa", title: "Ver Mapa 📍" }
        ];
        await this.sendButtons(to, "¡Hola! Bienvenido a *Grupo 360* 🏢\n\nSelecciona una opción:", principal);
    }

    async sendImage(to, imageUrl, caption) {
        try {
            const response = await axios.post(
                `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: to,
                    type: "image",
                    image: {
                        link: imageUrl,
                        caption: caption // Un texto opcional debajo de la foto
                    }
                },
                { headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` } }
            );
            return response.data;
        } catch (error) {
            console.error("Error enviando imagen:", error.response.data);
            throw error;
        }
    }
}

module.exports = new WhatsAppService();