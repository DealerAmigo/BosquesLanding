require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// **IMPORTANTE:** Reemplaza esta URL con la URL de tu App Script de Google Sheets.
// La URL de tu App Script va aquí. Es el 'enlace' que el servidor de Node.js usa para hablar con tu hoja de Google. Se obtiene al desplegar el script.
const GOOGLE_SHEET_APP_URL = 'https://script.google.com/macros/s/AKfycby1k60FcOM8WPoTNloHQZYhDY49v76dZw16pyx0ckCQt1PABzKETrwCvEHLJAtm1tLu/exec';

// Ruta para recibir los datos del cliente desde tu bot.
app.post('/save-client-data', async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log('Datos recibidos del bot:', { name, email, phone, message });

  if (!name || !email) {
    return res.status(400).json({ error: 'Faltan datos del cliente.' });
  }

  try {
    // Envía los datos a Google Sheets.
    const response = await axios.post(GOOGLE_SHEET_APP_URL, {
      name,
      email,
      phone,
      message,
    });

    console.log('Respuesta de Google Sheets:', response.data);

    res.status(200).json({
      message: 'Datos del cliente guardados en Google Sheets.',
      gs_response: response.data,
    });
  } catch (error) {
    console.error('Error al enviar datos a Google Sheets:', error);
    res.status(500).json({
      message: 'Error en el servidor al guardar los datos.',
      error: error.message,
    });
  }
});

// Inicia el servidor.
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
