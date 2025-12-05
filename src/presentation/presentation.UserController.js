// DDD - Presentation Layer (Rutas/Controllers)
// Controlador para manejar peticiones HTTP de usuarios

const express = require('express');
const router = express.Router();
const userService = require('../application');

// POST: Registrar nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, correoElectronico, numeroCelular, fechaNacimiento } = req.body;

    if (!nombre || !apellido || !correoElectronico || !numeroCelular || !fechaNacimiento) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos'
      });
    }

    const result = await userService.registerUser({
      nombre, apellido, correoElectronico, numeroCelular, fechaNacimiento
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message, errors: error.errors });
    }
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET: Verificar disponibilidad de correo (DEBE SER ANTES DE /:id)
router.get('/check/email', async (req, res) => {
  try {
    const { email, excludeId } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'El correo es requerido' });
    }

    const result = await userService.checkEmailAvailability(email, excludeId);
    res.json(result);
  } catch (error) {
    console.error('Error al verificar email:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET: Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.json(result);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET: Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT: Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correoElectronico, numeroCelular, fechaNacimiento } = req.body;

    if (!nombre || !apellido || !correoElectronico || !numeroCelular || !fechaNacimiento) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos'
      });
    }

    const result = await userService.updateUser(id, {
      nombre, apellido, correoElectronico, numeroCelular, fechaNacimiento
    });

    res.json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message, errors: error.errors });
    }
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// DELETE: Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
