// DDD - Boot/Entry Point
// Servidor Express con arquitectura DDD

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Importar controlador de usuario (Presentation Layer)
// Los archivos están en la carpeta src/
let userController;
try {
  // Cargar desde src/presentation
  userController = require('./src/presentation');
} catch (e) {
  try {
    // Fallback: intentar desde raíz (si se reorganiza)
    userController = require('./presentation.UserController');
  } catch (e2) {
    console.error('✗ Error: No se encontró el controlador');
    console.error('Se esperaba en: ./src/presentation o ./presentation.UserController');
    process.exit(1);
  }
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
