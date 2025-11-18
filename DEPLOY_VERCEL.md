# Guía de Despliegue en Vercel

## ⚠️ IMPORTANTE: Arquitectura del Proyecto

Este proyecto tiene **dos partes separadas**:

1. **Frontend (Angular)** → Se despliega en **Vercel**
2. **Backend (Node.js/Express + SQL Server)** → Se despliega en otro servicio (Railway, Render, Heroku, etc.)

## 📋 Paso 1: Desplegar el Backend

El backend **NO puede ir en Vercel** porque necesita:
- SQL Server (base de datos)
- Servidor Node.js persistente
- Almacenamiento para archivos Excel

### Opciones para el Backend:

#### Opción A: Railway (Recomendado - Gratis)
1. Ve a [railway.app](https://railway.app)
2. Crea una cuenta
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio
5. Configura:
   - **Root Directory:** `Server-Node-Express-`
   - **Start Command:** `npm start`
6. Agrega variables de entorno:
   - `DB_SERVER` = tu servidor SQL Server
   - `DB_NAME` = SistemaPagos
   - `DB_USER` = tu usuario SQL
   - `DB_PASSWORD` = tu contraseña SQL
7. Railway te dará una URL como: `https://tu-proyecto.railway.app`

#### Opción B: Render
1. Ve a [render.com](https://render.com)
2. Crea cuenta y nuevo "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Root Directory:** `Server-Node-Express-`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Agrega las mismas variables de entorno

#### Opción C: Heroku
1. Ve a [heroku.com](https://heroku.com)
2. Crea una nueva app
3. Conecta con GitHub
4. Configura las variables de entorno
5. Deploy

## 📋 Paso 2: Configurar el Frontend para Vercel

### 1. Actualizar el archivo de environment de producción

Edita `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
    production: true,
    endpoint: 'https://tu-backend.railway.app/' // URL de tu backend desplegado
};
```

**Reemplaza** `'https://tu-backend.railway.app/'` con la URL real de tu backend.

### 2. Desplegar en Vercel

#### Opción A: Desde la Web de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Clic en "Add New Project"
4. Importa tu repositorio `Ezkm2024/SistemaPagos`
5. Configura el proyecto:
   - **Framework Preset:** Angular
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build -- --configuration production`
   - **Output Directory:** `dist/banco-cla`
6. Clic en "Deploy"

#### Opción B: Desde la Terminal (CLI)

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Navega a la carpeta del frontend:
```bash
cd frontend
```

3. Inicia sesión:
```bash
vercel login
```

4. Despliega:
```bash
vercel --prod
```

## 🔧 Configuración Adicional

### Variables de Entorno en Vercel

Si necesitas variables de entorno en el frontend:

1. En Vercel, ve a tu proyecto
2. Settings → Environment Variables
3. Agrega las variables necesarias

### CORS en el Backend

Asegúrate de que tu backend permita las peticiones desde Vercel. En `Server-Node-Express-/server.js` ya está configurado CORS para aceptar todas las peticiones.

## ✅ Verificación

Después del despliegue:

1. **Frontend:** Deberías tener una URL como `https://tu-proyecto.vercel.app`
2. **Backend:** Deberías tener una URL como `https://tu-backend.railway.app`
3. **Prueba:** Abre el frontend y verifica que se conecte al backend

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module"
- Verifica que el `Root Directory` en Vercel sea `frontend`
- Asegúrate de que `package.json` esté en la carpeta `frontend`

### Error: "Build failed"
- Verifica que el comando de build sea: `npm run build -- --configuration production`
- Revisa los logs de build en Vercel

### Error: "CORS error"
- Verifica que la URL del backend en `environment.prod.ts` sea correcta
- Asegúrate de que el backend esté corriendo y accesible

### El frontend no se conecta al backend
- Verifica que la URL en `environment.prod.ts` termine con `/`
- Verifica que el backend esté desplegado y funcionando
- Prueba la URL del backend directamente en el navegador

## 📝 Notas Importantes

- El backend y frontend deben estar desplegados por separado
- La URL del backend debe ser HTTPS (Vercel requiere HTTPS)
- SQL Server debe ser accesible desde internet (o usar un servicio en la nube)
- Los archivos Excel se generan en el servidor del backend

## 🔗 Enlaces Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Railway](https://railway.app)
- [Render](https://render.com)

