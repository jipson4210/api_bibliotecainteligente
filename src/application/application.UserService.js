// DDD - Application Layer (Casos de uso)
// Service para manejar operaciones de usuario

const User = require('../domain/domain.User');
const pool = require('../infrastructure/infrastructure.Database');

class UserApplicationService {
  
  async registerUser(userData) {
    const connection = await pool.getConnection();
    try {
      const user = new User(
        userData.nombre,
        userData.apellido,
        userData.correoElectronico,
        userData.numeroCelular,
        userData.fechaNacimiento
      );

      const validation = user.validate();
      if (!validation.valid) {
        throw { status: 400, message: 'Errores en la validación', errors: validation.errors };
      }

      const [existingUsers] = await connection.query(
        'SELECT id FROM usuarios WHERE correoElectronico = ?',
        [userData.correoElectronico]
      );

      if (existingUsers.length > 0) {
        throw { status: 409, message: 'El correo electrónico ya está registrado' };
      }

      // Convertir la fecha al formato YYYY-MM-DD
      const fechaFormato = this.formatearFecha(userData.fechaNacimiento);

      const [result] = await connection.query(
        'INSERT INTO usuarios (nombre, apellido, correoElectronico, numeroCelular, fechaNacimiento) VALUES (?, ?, ?, ?, ?)',
        [userData.nombre, userData.apellido, userData.correoElectronico, userData.numeroCelular, fechaFormato]
      );

      const [newUser] = await connection.query(
        'SELECT * FROM usuarios WHERE id = ?',
        [result.insertId]
      );

      return {
        message: '¡Registro exitoso! Bienvenido a Biblioteca Inteligente.',
        user: newUser[0]
      };

    } finally {
      connection.release();
    }
  }

  async getAllUsers() {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query('SELECT * FROM usuarios ORDER BY createdAt DESC');
      return { total: users.length, users };
    } finally {
      connection.release();
    }
  }

  async getUserById(id) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      if (users.length === 0) {
        throw { status: 404, message: 'Usuario no encontrado' };
      }
      return users[0];
    } finally {
      connection.release();
    }
  }

  async updateUser(id, userData) {
    const connection = await pool.getConnection();
    try {
      const user = new User(
        userData.nombre,
        userData.apellido,
        userData.correoElectronico,
        userData.numeroCelular,
        userData.fechaNacimiento
      );

      const validation = user.validate();
      if (!validation.valid) {
        throw { status: 400, message: 'Errores en la validación', errors: validation.errors };
      }

      const [existingUsers] = await connection.query('SELECT id FROM usuarios WHERE id = ?', [id]);
      if (existingUsers.length === 0) {
        throw { status: 404, message: 'Usuario no encontrado' };
      }

      const [emailUsers] = await connection.query(
        'SELECT id FROM usuarios WHERE correoElectronico = ? AND id != ?',
        [userData.correoElectronico, id]
      );

      if (emailUsers.length > 0) {
        throw { status: 409, message: 'El correo electrónico ya está registrado por otro usuario' };
      }

      // Convertir la fecha al formato YYYY-MM-DD
      const fechaFormato = this.formatearFecha(userData.fechaNacimiento);

      await connection.query(
        'UPDATE usuarios SET nombre = ?, apellido = ?, correoElectronico = ?, numeroCelular = ?, fechaNacimiento = ? WHERE id = ?',
        [userData.nombre, userData.apellido, userData.correoElectronico, userData.numeroCelular, fechaFormato, id]
      );

      const [updatedUser] = await connection.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      return { message: 'Usuario actualizado exitosamente', user: updatedUser[0] };

    } finally {
      connection.release();
    }
  }

  async deleteUser(id) {
    const connection = await pool.getConnection();
    try {
      const [existingUsers] = await connection.query('SELECT id FROM usuarios WHERE id = ?', [id]);
      if (existingUsers.length === 0) {
        throw { status: 404, message: 'Usuario no encontrado' };
      }

      await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
      return { message: 'Usuario eliminado exitosamente' };

    } finally {
      connection.release();
    }
  }

  async checkEmailAvailability(email, excludeId = null) {
    const connection = await pool.getConnection();
    try {
      let query = 'SELECT id FROM usuarios WHERE correoElectronico = ?';
      let params = [email];

      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const [users] = await connection.query(query, params);
      return { email, available: users.length === 0 };

    } finally {
      connection.release();
    }
  }

  // Convertir fecha ISO (2023-11-19T05:00:00.000Z) a formato MySQL (YYYY-MM-DD)
  formatearFecha(fecha) {
    if (!fecha) return null;
    
    try {
      // Si es string ISO, tomar solo la parte de la fecha
      if (typeof fecha === 'string') {
        return fecha.split('T')[0]; // '1991-11-19T05:00:00.000Z' -> '1991-11-19'
      }
      
      // Si es objeto Date
      if (fecha instanceof Date) {
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const día = String(fecha.getDate()).padStart(2, '0');
        return `${año}-${mes}-${día}`;
      }
      
      return fecha;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return fecha;
    }
  }
}

module.exports = new UserApplicationService();
