// DDD - Infrastructure Layer
// Pool de conexión a MySQL

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'biblioteca_user',
  password: process.env.DB_PASSWORD || 'biblioteca_password',
  database: process.env.DB_NAME || 'biblioteca_inteligente',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Configurar SSL para Azure
if (process.env.DB_SSL_CA) {
  const certPath = process.env.DB_SSL_CA;
  if (fs.existsSync(certPath)) {
    poolConfig.ssl = {
      ca: fs.readFileSync(certPath)
    };
  } else {
    console.warn(`⚠ Archivo de certificado no encontrado: ${certPath}`);
  }
} else if (process.env.DB_HOST && process.env.DB_HOST.includes('azure')) {
  // Para Azure, usar SSL sin validar certificado si no se proporciona archivo
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = mysql.createPool(poolConfig);

// Verificar conexión (no es fatal si falla, se reintentará en tiempo de ejecución)
pool.getConnection()
  .then(connection => {
    console.log('✓ Conexión a MySQL exitosa');
    connection.release();
  })
  .catch(err => {
    console.warn('⚠ Advertencia: No se pudo conectar a MySQL en el arranque:', err.message);
    console.warn('  Las conexiones se intentarán cuando se realice la primera petición');
  });

module.exports = pool;
