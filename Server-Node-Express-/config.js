// Configuración de conexión a SQL Server
// Modifica estos valores según tu configuración de SQL Server

module.exports = {
  server: process.env.DB_SERVER || 'localhost', // o la IP de tu servidor SQL
  database: process.env.DB_NAME || 'SistemaPagos',
  user: process.env.DB_USER || 'sa', // Usuario de SQL Server
  password: process.env.DB_PASSWORD || 'tu_password', // Contraseña de SQL Server
  options: {
    encrypt: false, // Usar true si es Azure SQL
    trustServerCertificate: true, // Usar true para desarrollo local
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

