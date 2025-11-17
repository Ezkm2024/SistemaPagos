# Sistema de Pagos Online

Sistema completo de gestión de pagos online con registro de ventas y exportación a Excel.

Desarrollado para la **Prof. Paula Robles** del Profesorado Francisco de Paula Robles, ubicado en la ciudad de **Dolores, Buenos Aires**.

## Características

- ✅ Registro de pagos online
- ✅ Visualización de ventas con filtros por empresa y fecha
- ✅ Búsqueda en tiempo real de ventas
- ✅ Dashboard con estadísticas (total ventas, recaudado, promedio)
- ✅ Gestión completa de empresas (Crear, Editar, Eliminar)
- ✅ Exportación de ventas a Excel
- ✅ Interfaz moderna y responsive con diseño personalizado

## Estructura del Proyecto

```
robles-payment-main/
├── frontend/          # Aplicación Angular
│   └── src/
│       └── app/
│           ├── form/              # Formulario de pago
│           ├── pago/              # Confirmación de pago
│           ├── ventas/            # Listado y filtrado de ventas
│           ├── add-edit-empresas/ # Gestión de empresas
│           └── services/          # Servicios HTTP
└── Server-Node-Express-/  # Backend Node.js/Express
    ├── server.js       # Servidor principal
    ├── data/           # Archivos JSON (pagos, empresas)
    └── downloads/      # Archivos Excel generados
```

## Instalación y Configuración

### Backend

1. Navegar a la carpeta del servidor:
```bash
cd Server-Node-Express-
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor:
```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

### Frontend

1. Navegar a la carpeta del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar la aplicación:
```bash
npm start
```

La aplicación se ejecutará en `http://localhost:4200`

## Uso

### Registrar un Pago

1. En la página principal, completa el formulario con:
   - Nombre y apellido del cliente
   - Empresa a pagar
   - Importe
   - Método de pago

2. Haz clic en "Confirmar pago"

### Ver Ventas

1. Navega a la sección "Ventas"
2. Visualiza las estadísticas en tiempo real:
   - Total de ventas
   - Total recaudado
   - Promedio por venta
3. Usa la búsqueda para encontrar ventas específicas
4. Usa los filtros para buscar por:
   - Empresa
   - Rango de fechas
5. Haz clic en "Descargar Excel" para exportar los resultados

### Gestionar Empresas

1. Navega a la sección "Empresas"
2. Para crear: Haz clic en "Nueva Empresa" y completa el formulario
3. Para editar: Haz clic en "Editar" en la empresa deseada
4. Para eliminar: Haz clic en "Eliminar" (se pedirá confirmación)

## Tecnologías Utilizadas

### Frontend
- Angular 15
- Bootstrap 5
- TypeScript
- RxJS

### Backend
- Node.js
- Express
- XLSX (para generación de Excel)
- CORS

## Notas

- Los datos se almacenan en archivos JSON en el servidor
- Los archivos Excel se generan dinámicamente y se descargan automáticamente
- El sistema está preparado para ser desplegado en producción
- Diseño personalizado con paleta de colores rojos profesional
