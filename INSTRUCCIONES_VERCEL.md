# 🚀 Instrucciones para Desplegar en Vercel

## ⚠️ IMPORTANTE: Configuración en Vercel

Cuando despliegues en Vercel, **configura manualmente estos valores**:

### Configuración del Proyecto en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → General
3. Configura:

**Root Directory:** `frontend`

**Build Command:** 
```
npm install && npm run vercel-build
```

**Output Directory:** 
```
dist/banco-cla
```

**Install Command:**
```
npm install
```

### O desde la interfaz web:

1. Al crear/importar el proyecto, en "Configure Project":
   - **Framework Preset:** Other
   - **Root Directory:** `frontend` (cambia de raíz a frontend)
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `dist/banco-cla`
   - **Install Command:** `npm install`

## 📝 Pasos Completos

### 1. Desplegar Backend primero (Railway/Render)

El backend debe estar desplegado antes del frontend.

### 2. Actualizar URL del Backend

Edita `frontend/src/environments/environment.prod.ts`:
```typescript
endpoint: 'https://tu-backend.railway.app/'
```

### 3. Desplegar Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. "Add New Project"
3. Importa tu repositorio
4. **IMPORTANTE:** Configura manualmente:
   - Root Directory: `frontend`
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist/banco-cla`
5. Deploy

## ✅ Verificación

Después del deploy, verifica:
- La URL de Vercel carga correctamente
- No hay errores 404
- El frontend se conecta al backend

