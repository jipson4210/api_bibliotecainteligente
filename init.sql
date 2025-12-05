-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correoElectronico VARCHAR(255) NOT NULL UNIQUE,
  numeroCelular VARCHAR(20) NOT NULL,
  fechaNacimiento DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear índices para mejor rendimiento
CREATE INDEX idx_email ON usuarios(correoElectronico);
CREATE INDEX idx_createdAt ON usuarios(createdAt);

-- Insertar algunos datos de ejemplo (opcional)
INSERT INTO usuarios (nombre, apellido, correoElectronico, numeroCelular, fechaNacimiento) 
VALUES 
('Juan', 'Pérez', 'juan@ejemplo.com', '3215551234', '1990-05-15'),
('María', 'González', 'maria@ejemplo.com', '3105552345', '1992-08-20');
