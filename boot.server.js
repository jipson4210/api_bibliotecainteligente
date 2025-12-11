// DDD - Boot/Entry Point
// Servidor Express con arquitectura DDD

const express = require('express');
const cors = require('cors');
require('dotenv').config();

console.log('=== INICIANDO SERVIDOR ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'desarrollo');
console.log('PORT:', process.env.PORT || 3000);
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Importar controlador de usuario (Presentation Layer)
let userController;
try {
  console.log('Cargando controlador de usuarios...');
  userController = require('./src/presentation');
  console.log('✓ Controlador cargado correctamente');
} catch (e) {
  console.error('✗ Error al cargar el controlador:', e.message);
  console.error('Stack completo:', e.stack);
  process.exit(1);
}

// Usar rutas
app.use('/api/users', userController);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'API funcionando correctamente', timestamp: new Date() });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
});
