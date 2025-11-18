# Servidor Backend - Sistema de Pagos

Servidor Node.js con Express para gestionar pagos, empresas y exportación a Excel.

## Instalación

1. Instalar dependencias:
```bash
npm install
```

## Ejecución

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## Endpoints

### Pagos
- `GET /ventas` - Obtener todas las ventas
- `GET /ventas/filtradas?idEmpresa=X&fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD` - Obtener ventas filtradas
- `POST /api/pagos` - Registrar un nuevo pago
- `GET /ventas/excel?idEmpresa=X&fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD` - Descargar ventas en Excel

### Empresas
- `GET /empresas` - Obtener todas las empresas
- `GET /` - Obtener empresas disponibles para pago
- `POST /empresas` - Crear nueva empresa
- `PUT /empresas/:id` - Actualizar empresa
- `DELETE /empresas/:id` - Eliminar empresa

## Estructura de Datos

Los datos se almacenan en **SQL Server** en la base de datos `SistemaPagos`:
- Tabla `Pagos` - Registro de todos los pagos
- Tabla `Empresas` - Lista de empresas

**Importante:** Antes de iniciar el servidor, ejecuta el script `database.sql` en SQL Server Management Studio para crear la base de datos y las tablas.

Los archivos Excel generados se guardan temporalmente en la carpeta `downloads/`.


