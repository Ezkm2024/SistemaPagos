# ¿Cuándo se usa SQL Server?

## SQL Server se usa AUTOMÁTICAMENTE en estos momentos:

### 1. **Al iniciar el servidor** (Backend)
Cuando ejecutas `npm start` en `Server-Node-Express-`, el servidor:
- Se conecta automáticamente a SQL Server
- Si la conexión falla, el servidor NO inicia
- Verás el mensaje: "✅ Conectado a SQL Server correctamente"

### 2. **Cada vez que se registra un pago**
Cuando un usuario completa el formulario de pago:
- El pago se guarda **directamente en SQL Server** (tabla `Pagos`)
- NO se guarda en archivos JSON
- Se genera automáticamente un Excel del pago

### 3. **Cada vez que se consultan las ventas**
Cuando vas a la sección "Ver Pagos":
- Los datos se obtienen **directamente de SQL Server**
- Se ejecuta el procedimiento almacenado `sp_ObtenerVentasFiltradas`
- Los filtros (empresa, fecha) se aplican en SQL

### 4. **Cada vez que se gestionan empresas**
- Crear empresa → Se guarda en SQL Server (tabla `Empresas`)
- Editar empresa → Se actualiza en SQL Server
- Eliminar empresa → Se marca como inactiva en SQL Server

### 5. **Al descargar Excel de ventas**
- Los datos se obtienen de SQL Server
- Se genera el Excel con los datos filtrados

## IMPORTANTE: Configuración necesaria

**ANTES de usar el sistema, debes:**

1. ✅ Ejecutar el script `database.sql` en SQL Server Management Studio
2. ✅ Configurar `Server-Node-Express-/config.js` con tus credenciales de SQL Server
3. ✅ Instalar dependencias: `npm install` en `Server-Node-Express-`

## Resumen

**SQL Server se usa SIEMPRE** - No hay archivos JSON, todo se guarda en la base de datos.

Si SQL Server no está configurado o no está corriendo, el sistema NO funcionará.

