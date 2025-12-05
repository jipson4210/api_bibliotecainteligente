// DDD - Domain Driven Design
// DOMAIN LAYER: Entity
// Modelo de dominio para Usuario

class User {
  constructor(nombre, apellido, correoElectronico, numeroCelular, fechaNacimiento, id = null) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.correoElectronico = correoElectronico;
    this.numeroCelular = numeroCelular;
    this.fechaNacimiento = fechaNacimiento;
  }

  validate() {
    const errors = {};

    if (!this.nombre || this.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!this.apellido || this.apellido.trim().length < 2) {
      errors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.correoElectronico || !emailRegex.test(this.correoElectronico)) {
      errors.correoElectronico = 'El correo debe ser válido';
    }

    const phoneRegex = /^\d{7,15}$/;
    if (!this.numeroCelular || !phoneRegex.test(this.numeroCelular)) {
      errors.numeroCelular = 'El número debe contener entre 7 y 15 dígitos';
    }

    if (!this.fechaNacimiento) {
      errors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    }

    return Object.keys(errors).length === 0 ? { valid: true } : { valid: false, errors };
  }
}

module.exports = User;
