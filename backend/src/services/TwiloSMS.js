const twilio = require('twilio');

// Asegúrate de usar exactamente los nombres que pusiste en tu .env
// En tu .env pusiste ACCOUNT_SID (sin el prefijo TWILIO_)
const accountSid = process.env.ACCOUNT_SID; 
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

class SmsService {
  // Cambiamos el nombre a 'enviarSms' para que coincida con tu RecuperacionService
  async enviarSms(telefono, codigo_o_mensaje) {
    try {
      // Si mandas el código solo, aquí armamos el texto
      const texto = codigo_o_mensaje.length <= 6 
        ? `Tu codigo de recuperacion es: ${codigo_o_mensaje}` 
        : codigo_o_mensaje;

      const mensaje = await client.messages.create({
        body: texto,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: telefono
      });
      
      console.log("SMS Enviado correctamente, SID:", mensaje.sid);
      return mensaje.sid;
    } catch (error) {
      console.error("Error detallado de Twilio:", error.code, error.message);
      throw new Error("No se pudo enviar el SMS de recuperación");
    }
  }
}

module.exports = new SmsService();