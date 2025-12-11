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
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
};

// Log de configuración (sin contraseña)
console.log('📊 Configuración de Base de Datos:');
console.log(`  Host: ${poolConfig.host}`);
console.log(`  Puerto: ${poolConfig.port}`);
console.log(`  Usuario: ${poolConfig.user}`);
console.log(`  Base de datos: ${poolConfig.database}`);

// Configurar SSL para Azure
if (process.env.DB_SSL_CA) {
  const certPath = process.env.DB_SSL_CA;
  if (fs.existsSync(certPath)) {
    poolConfig.ssl = {
      ca: fs.readFileSync(certPath)
    };
    console.log(`  SSL: Certificado cargado desde ${certPath}`);
  } else {
    console.warn(`⚠️  Certificado no encontrado: ${certPath}`);
  }
} else if (process.env.DB_HOST && process.env.DB_HOST.includes('azure')) {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
  console.log('  SSL: Habilitado (sin validar certificado - Azure)');
}

const pool = mysql.createPool(poolConfig);

// Verificar conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexión a MySQL: EXITOSA');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Conexión a MySQL: FALLIDA');
    console.error('   Código:', err.code);
    console.error('   Mensaje:', err.message);
    
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   Problema: Credenciales incorrectas (usuario/contraseña)');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('   Problema: Base de datos no existe');
    } else if (err.code === 'ENOTFOUND' || err.code === 'EHOSTUNREACH') {
      console.error('   Problema: No se puede alcanzar el servidor (hostname/firewall)');
    } else if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('   Problema: Conexión perdida (posible firewall o timeout)');
    }
    console.error('   Las conexiones se reintentarán cuando se realice la primera petición');
  });

module.exports = pool;
