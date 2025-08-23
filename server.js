const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '🚗 TU Dealer Amigo API',
    status: 'Funcionando correctamente',
    endpoints: {
      health: 'GET /health',
      leads: 'POST /api/leads'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'TU Dealer Amigo Backend funcionando perfectamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Endpoint para recibir leads
app.post('/api/leads', (req, res) => {
  console.log('Lead recibido:', req.body);
  
  const { name, phone, email, interest, source, timestamp } = req.body;
  
  // Validación básica
  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Nombre y teléfono son requeridos',
      error: 'Missing required fields'
    });
  }
  
  // Log del lead para seguimiento
  console.log(`
    ===== NUEVO LEAD =====
    Nombre: ${name}
    Teléfono: ${phone}
    Email: ${email || 'No proporcionado'}
    Interés: ${interest || 'No especificado'}
    Fuente: ${source || 'No especificada'}
    Fecha: ${timestamp || new Date().toISOString()}
    ======================
  `);
  
  res.status(200).json({
    success: true,
    message: 'Lead recibido exitosamente',
    data: { 
      name, 
      phone, 
      email: email || null,
      interest: interest || null,
      received_at: new Date().toISOString()
    }
  });
});

// Endpoint alternativo para leads (por si acaso)
app.post('/leads', (req, res) => {
  // Redirigir a la ruta principal
  req.url = '/api/leads';
  app._router.handle(req, res);
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: 'Verifica la URL y el método HTTP',
    available_endpoints: {
      'GET /': 'Info de la API',
      'GET /health': 'Health check',
      'POST /api/leads': 'Recibir lead',
      'POST /leads': 'Recibir lead (alternativo)'
    }
  });
});

// Manejo de errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: 'Algo salió mal, intenta de nuevo'
  });
});

app.listen(PORT, () => {
  console.log(`🚗 TU Dealer Amigo Backend corriendo en puerto ${PORT}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   GET  / - Info de la API`);
  console.log(`   GET  /health - Health check`);
  console.log(`   POST /api/leads - Recibir leads`);
});

module.exports = app;
