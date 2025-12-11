// DDD - Boot/Entry Point
// Servidor Express con arquitectura DDD

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Determine port: prioritize PORT env var, then use 3000 as default
// IIS with iisnode will set PORT dynamically
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('=== INICIANDO SERVIDOR ===');
console.log('NODE_ENV:', NODE_ENV);
console.log('PORT:', PORT);
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint de salud (sin dependencias)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'API funcionando correctamente', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Importar controlador de usuario (Presentation Layer)
let userController;
try {
  console.log('Cargando controlador de usuarios...');
  userController = require('./src/presentation');
  console.log('✓ Controlador cargado correctamente');
  app.use('/api/users', userController);
} catch (e) {
  console.error('✗ Error al cargar el controlador:', e.message);
  console.error('Stack completo:', e.stack);
  // No salir, solo advertencia - la ruta /api/health funciona igual
}

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Servidor corriendo en puerto ${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
});

// Timeout para keep-alive en IIS
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
