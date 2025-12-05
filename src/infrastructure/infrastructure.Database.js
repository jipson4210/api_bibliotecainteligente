// DDD - Infrastructure Layer
// Pool de conexión a MySQL

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'biblioteca_user',
  password: process.env.DB_PASSWORD || 'biblioteca_password',
  database: process.env.DB_NAME || 'biblioteca_inteligente',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('✓ Conexión a MySQL exitosa');
    connection.release();
  })
  .catch(err => {
    console.error('✗ Error al conectar MySQL:', err.message);
  });

module.exports = pool;
