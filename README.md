# Sistema de Pagos Online

Sistema completo de gestión de pagos online con registro de ventas y exportación a Excel.

Desarrollado para la **Prof. Paula Robles** del Profesorado Francisco de Paula Robles, ubicado en la ciudad de **Dolores, Buenos Aires**.

## 🚀 Características

- ✅ Registro de pagos online con guardado automático en SQL Server
- ✅ Generación automática de Excel al completar cada pago
- ✅ Visualización de ventas con filtros por empresa y fecha
- ✅ Búsqueda en tiempo real de ventas
- ✅ Dashboard con estadísticas (total ventas, recaudado, promedio)
- ✅ Gestión completa de empresas (Crear, Editar, Eliminar)
- ✅ Exportación de ventas a Excel con filtros aplicados
- ✅ Interfaz moderna y responsive con diseño personalizado
- ✅ Base de datos SQL Server para almacenamiento persistente

## 📋 Requisitos Previos

- **Node.js** (versión 14 o superior)
- **SQL Server** (cualquier versión: Express, Standard, Developer, etc.)
- **SQL Server Management Studio (SSMS)** (para ejecutar el script SQL)
- **npm** (viene con Node.js)

## 🗂️ Estructura del Proyecto

```
robles-payment-main/
├── frontend/                    # Aplicación Angular
│   ├── src/
│   │   └── app/
│   │       ├── form/            # Formulario de pago
│   │       ├── pago/            # Confirmación de pago
│   │       ├── ventas/          # Listado y filtrado de ventas
│   │       ├── add-edit-empresas/ # Gestión de empresas
│   │       └── services/        # Servicios HTTP
│   └── package.json
│
└── Server-Node-Express-/        # Backend Node.js/Express
    ├── server.js                # Servidor principal
    ├── config.js                # Configuración de SQL Server
    ├── database.sql             # Script para crear la base de datos
    ├── downloads/               # Archivos Excel generados
    └── package.json
```

## 📦 Instalación y Configuración

### Paso 1: Configurar SQL Server

1. **Abre SQL Server Management Studio (SSMS)**

2. **Conéctate a tu servidor SQL Server**

3. **Ejecuta el script SQL:**
   - Abre el archivo `Server-Node-Express-/database.sql`
   - Ejecuta todo el script (F5 o botón "Execute")
   - Verifica que se creó la base de datos `SistemaPagos` y las tablas:
     - `Empresas`
     - `Pagos`

### Paso 2: Configurar la Conexión a SQL Server

1. **Abre el archivo `Server-Node-Express-/config.js`**

2. **Modifica los valores según tu configuración:**

```javascript
module.exports = {
  server: 'localhost',           // IP o nombre de tu servidor SQL
  database: 'SistemaPagos',      // Nombre de la base de datos
  user: 'sa',                    // Usuario de SQL Server
  password: 'tu_password',       // Contraseña de SQL Server
  // ...
};
```

**Ejemplos de configuración:**

- **SQL Server Local:**
  ```javascript
  server: 'localhost',
  user: 'sa',
  password: 'TuPassword123',
  ```

- **SQL Server Express:**
  ```javascript
  server: 'localhost\\SQLEXPRESS',
  user: 'sa',
  password: 'TuPassword',
  ```

- **SQL Server en otra máquina:**
  ```javascript
  server: '192.168.1.100',  // IP de la máquina
  user: 'usuario_sql',
  password: 'password123',
  ```

### Paso 3: Instalar y Configurar el Backend

1. **Navegar a la carpeta del servidor:**
```bash
cd Server-Node-Express-
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar el servidor:**
```bash
npm start
```

**O para desarrollo con auto-reload:**
```bash
npm run dev
```

**✅ Verificación:** Si ves el mensaje:
```
✅ Conectado a SQL Server correctamente
📊 Base de datos: SistemaPagos
🚀 Servidor corriendo en http://localhost:3000
```

¡El backend está funcionando correctamente!

### Paso 4: Instalar y Configurar el Frontend

**Abre una nueva terminal** (deja el backend corriendo)

1. **Navegar a la carpeta del frontend:**
```bash
cd frontend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar la aplicación:**
```bash
npm start
```

**O:**
```bash
ng serve
```

**✅ Verificación:** La aplicación se abrirá automáticamente en:
```
http://localhost:4200
```

## 🎯 Cómo Usar el Sistema

### Registrar un Pago

1. En la página principal (Inicio), completa el formulario:
   - **Nombre** del cliente
   - **Apellido** del cliente
   - **Empresa a pagar** (selecciona de la lista)
   - **Importe** a pagar
   - **Método de pago** (Tarjeta)

2. Haz clic en **"Confirmar pago"**

3. **Resultado:**
   - El pago se guarda automáticamente en SQL Server
   - Se genera un archivo Excel con los datos del pago
   - Aparece la página de confirmación con botón para descargar el Excel

### Ver Todos los Pagos Realizados

**Tres formas de acceder:**

1. **Menú de navegación:** Clic en **"📊 Ver Pagos"** (en la parte superior)
2. **Desde confirmación:** Clic en **"📊 Ver Todos los Pagos"** después de registrar un pago
3. **URL directa:** Navega a `http://localhost:4200/ventas`

**En la sección de Ventas podrás:**

- Ver **estadísticas en tiempo real:**
  - Total de ventas
  - Total recaudado
  - Promedio por venta

- **Buscar ventas:**
  - Busca por nombre, apellido, empresa o importe
  - Búsqueda en tiempo real

- **Filtrar ventas:**
  - Por empresa
  - Por rango de fechas (fecha inicio y fecha fin)

- **Ver tabla completa:**
  - ID Pago, Nombre, Apellido, Empresa, Importe, Método, Fecha

- **Descargar Excel:**
  - Exporta todos los pagos (con filtros aplicados si los hay)
  - Formato Excel listo para imprimir o compartir

### Gestionar Empresas

1. Navega a la sección **"🏢 Empresas"** (menú superior)

2. **Crear nueva empresa:**
   - Clic en **"+ Nueva Empresa"**
   - Ingresa el nombre
   - Clic en **"Crear"**

3. **Editar empresa:**
   - Clic en **"Editar"** en la empresa deseada
   - Modifica el nombre
   - Clic en **"Actualizar"**

4. **Eliminar empresa:**
   - Clic en **"Eliminar"**
   - Confirma la eliminación
   - La empresa se marca como inactiva (no se elimina físicamente)

## 🔧 Solución de Problemas

### Error: "Login failed for user"
- ✅ Verifica que el usuario y contraseña en `config.js` sean correctos
- ✅ Asegúrate de que SQL Server esté configurado para **autenticación mixta** (SQL + Windows)

### Error: "Cannot connect to server"
- ✅ Verifica que SQL Server esté corriendo
- ✅ Verifica que el puerto 1433 esté abierto
- ✅ Si es SQL Server Express, usa: `localhost\\SQLEXPRESS` en `config.js`

### Error: "Database does not exist"
- ✅ Ejecuta el script `database.sql` primero en SSMS
- ✅ Verifica que el nombre de la base de datos en `config.js` sea `SistemaPagos`

### El servidor no inicia
- ✅ Verifica que SQL Server esté corriendo
- ✅ Verifica la configuración en `config.js`
- ✅ Revisa los mensajes de error en la consola

### El frontend no se conecta al backend
- ✅ Verifica que el backend esté corriendo en `http://localhost:3000`
- ✅ Verifica la configuración en `frontend/src/environments/environments.ts`
- ✅ Asegúrate de que ambos servidores estén corriendo

## 📊 Tecnologías Utilizadas

### Frontend
- **Angular 15** - Framework de desarrollo
- **Bootstrap 5** - Estilos y componentes UI
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **mssql** - Driver para SQL Server
- **XLSX** - Generación de archivos Excel
- **CORS** - Habilitación de peticiones cross-origin

### Base de Datos
- **SQL Server** - Base de datos relacional
- **Procedimientos almacenados** - Para mejor rendimiento

## 📝 Notas Importantes

- ✅ **Los datos se almacenan en SQL Server**, no en archivos JSON
- ✅ **Cada pago genera automáticamente un Excel** con los datos
- ✅ **Los archivos Excel se guardan** en `Server-Node-Express-/downloads/`
- ✅ **El sistema usa procedimientos almacenados** para mejor rendimiento
- ✅ **Diseño personalizado** con paleta de colores rojos profesional
- ✅ **Totalmente responsive** - Funciona en móviles, tablets y desktop

## 🎨 Características del Diseño

- Paleta de colores rojos profesional (#950606, #7a0909, #FF2C2C)
- Efectos glassmorphism (fondos semitransparentes)
- Gradientes animados
- Transiciones suaves
- Cards informativas con estadísticas
- Tablas modernas con hover effects

## 📞 Soporte

Si tienes problemas:
1. Revisa la sección "Solución de Problemas" arriba
2. Verifica que todos los requisitos estén instalados
3. Asegúrate de que SQL Server esté corriendo
4. Revisa los logs del servidor para ver errores específicos

---

**Desarrollado para Prof. Paula Robles - Dolores, Buenos Aires** 🇦🇷
