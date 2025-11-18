# Instrucciones para Configurar SQL Server

## Paso 1: Ejecutar el Script SQL

1. Abre **SQL Server Management Studio (SSMS)**
2. Conéctate a tu servidor SQL Server
3. Abre el archivo `database.sql` que está en la carpeta `Server-Node-Express-`
4. Ejecuta todo el script (F5 o botón "Execute")
5. Verifica que se creó la base de datos `SistemaPagos` y las tablas

## Paso 2: Configurar la Conexión

1. Abre el archivo `config.js` en la carpeta `Server-Node-Express-`
2. Modifica los siguientes valores según tu configuración:

```javascript
module.exports = {
  server: 'localhost',        // IP o nombre de tu servidor SQL
  database: 'SistemaPagos',   // Nombre de la base de datos
  user: 'sa',                 // Usuario de SQL Server
  password: 'tu_password',    // Contraseña de SQL Server
  // ...
};
```

### Ejemplos de configuración:

**Para SQL Server Local:**
```javascript
server: 'localhost',
user: 'sa',
password: 'TuPassword123',
```

**Para SQL Server en otra máquina:**
```javascript
server: '192.168.1.100',  // IP de la máquina
user: 'usuario_sql',
password: 'password123',
```

**Para SQL Server Express:**
```javascript
server: 'localhost\\SQLEXPRESS',
user: 'sa',
password: 'TuPassword',
```

## Paso 3: Verificar la Conexión

1. Instala las dependencias:
```bash
cd Server-Node-Express-
npm install
```

2. Inicia el servidor:
```bash
npm start
```

3. Si ves el mensaje "✅ Conectado a SQL Server correctamente", todo está bien.

## Solución de Problemas

### Error: "Login failed for user"
- Verifica que el usuario y contraseña sean correctos
- Asegúrate de que SQL Server esté configurado para autenticación mixta (SQL + Windows)

### Error: "Cannot connect to server"
- Verifica que SQL Server esté corriendo
- Verifica que el puerto 1433 esté abierto
- Si es SQL Server Express, usa: `localhost\\SQLEXPRESS`

### Error: "Database does not exist"
- Ejecuta el script `database.sql` primero
- Verifica que el nombre de la base de datos en `config.js` sea correcto

## Notas Importantes

- Los datos ahora se guardan en SQL Server, no en archivos JSON
- Cada pago se registra automáticamente en la base de datos
- Las empresas también se guardan en SQL Server
- El sistema usa procedimientos almacenados para mejor rendimiento

