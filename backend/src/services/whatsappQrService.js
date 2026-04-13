const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const QRCode = require('qrcode');
const path = require('path');

class WhatsAppQRService {
    constructor() {
        this.sessions = {}; 
    }

    async conectar(empresaId, io) {
        const authPath = path.join(__dirname, `../../sesiones/empresa_${empresaId}`);
        const { state, saveCreds } = await useMultiFileAuthState(authPath);

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            // Opcional: añade opciones de keep-alive para que no se cierre en el VPS
            defaultQueryTimeoutMs: undefined 
        });

        this.sessions[empresaId] = sock;

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            // 1. Emitir QR al Frontend
            if (qr) {
                const qrBase64 = await QRCode.toDataURL(qr);
                io.to(`empresa_${empresaId}`).emit('qr_code', qrBase64);
            }

            // 2. Manejo de estados de conexión
            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                
                console.log(`Conexión cerrada empresa ${empresaId}. Razón: ${statusCode}. Reconectando: ${shouldReconnect}`);
                
                if (shouldReconnect) {
                    this.conectar(empresaId, io);
                } else {
                    delete this.sessions[empresaId];
                    io.to(`empresa_${empresaId}`).emit('whatsapp_status', 'DESCONECTADO');
                }
            } else if (connection === 'open') {
                console.log(`¡WhatsApp Abierto para Empresa ${empresaId}!`);
                io.to(`empresa_${empresaId}`).emit('whatsapp_status', 'CONECTADO');
            }
        });

        // 3. Escuchador de Mensajes (Donde entra tu IA)
        sock.ev.on('messages.upsert', async (m) => {
            if (m.type === 'notify') {
                const msg = m.messages[0];
                if (!msg.key.fromMe) {
                    const from = msg.key.remoteJid;
                    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

                    console.log(`Mensaje recibido de ${from} para empresa ${empresaId}: ${text}`);
                    
                    // Aquí llamarías a tu lógica de IA (Gemini/Groq)
                    // const response = await tuIA.generar(text, empresaId);
                    // await sock.sendMessage(from, { text: response });
                }
            }
        });

        return sock;
    }

    // Método para enviar mensajes desde otras partes de tu app
    async sendMessage(empresaId, to, message) {
        const client = this.sessions[empresaId];
        if (client) {
            await client.sendMessage(to, { text: message });
        }
    }
}

module.exports = new WhatsAppQRService();