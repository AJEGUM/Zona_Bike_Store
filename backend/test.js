const axios = require('axios');
require('dotenv').config();

const enviarPrueba = async () => {
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: "573002120317", // TU NÚMERO PERSONAL (verificado en Meta)
        type: "template",
        template: { name: "hello_world", language: { code: "en_US" } }
      },
      { headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` } }
    );
    console.log("¡Mensaje enviado, menor!", res.data);
  } catch (e) {
    console.error("Fallo la vuelta:", e.response.data);
  }
};

enviarPrueba();