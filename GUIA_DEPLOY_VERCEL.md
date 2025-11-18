# 🚀 Guía Rápida: Desplegar en Vercel

## ⚠️ IMPORTANTE

**Vercel solo despliega el FRONTEND (Angular).**  
El **BACKEND debe desplegarse en otro servicio** (Railway, Render, Heroku).

## 📋 Pasos Rápidos

### 1. Desplegar Backend (Railway - Recomendado)

1. Ve a [railway.app](https://railway.app) y crea cuenta
2. "New Project" → "Deploy from GitHub"
3. Selecciona tu repo
4. Configura:
   - **Root Directory:** `Server-Node-Express-`
   - **Start Command:** `npm start`
5. Agrega variables de entorno:
   ```
   DB_SERVER=tu_servidor_sql
   DB_NAME=SistemaPagos
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   ```
6. Copia la URL que te da Railway (ej: `https://tu-proyecto.railway.app`)

### 2. Configurar Frontend

Edita `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
    production: true,
    endpoint: 'https://TU-URL-RAILWAY.railway.app/' // ← Pega aquí la URL de Railway
};
```

### 3. Desplegar Frontend en Vercel

**Opción A: Desde la Web**
1. Ve a [vercel.com](https://vercel.com)
2. "Add New Project"
3. Importa tu repo de GitHub
4. Configura:
   - **Framework Preset:** Other
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build -- --configuration production`
   - **Output Directory:** `dist/banco-cla`
5. Click "Deploy"

**Opción B: Desde Terminal**
```bash
cd frontend
npm i -g vercel
vercel login
vercel --prod
```

## ✅ Listo!

Tu frontend estará en: `https://tu-proyecto.vercel.app`

## 🐛 Si da error

1. Verifica que el **Root Directory** sea `frontend`
2. Verifica que el **Build Command** sea correcto
3. Revisa los logs de build en Vercel
4. Asegúrate de que la URL del backend en `environment.prod.ts` sea correcta

