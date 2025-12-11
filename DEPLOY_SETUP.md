# 📚 Biblioteca Inteligente - Despliegue Limpio para Azure Linux

## 🎯 Resumen Ejecutivo

Tu proyecto está listo para desplegar en **Azure App Service (Linux)** con la arquitectura **Domain-Driven Design (DDD)**.

---

## 📁 Estructura Actual

```
✓ boot.server.js              ← Punto de entrada (Puerto 8080, interfaz 0.0.0.0)
✓ src/                        ← Código DDD (Domain, Application, Presentation, Infrastructure)
✓ package.json                ← Dependencias Node.js
✓ .env                        ← Variables de entorno locales
```

---

## 🚀 Despliegue Rápido en Azure (5 minutos)

### 1️⃣ Crear recursos Azure

```bash
# Grupo de recursos
az group create --name biblioteca-rg --location eastus

# Plan App Service (Linux)
az appservice plan create \
  --name biblioteca-plan \
  --resource-group biblioteca-rg \
  --is-linux --sku B1

# Web App
az webapp create \
  --resource-group biblioteca-rg \
  --plan biblioteca-plan \
  --name bibliotecainteligente \
  --runtime "node|18"
```

### 2️⃣ Configurar variables

```bash
az webapp config appsettings set \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    DB_HOST=mysql-biblioteca-utm.mysql.database.azure.com \
    DB_USER=biblioteca_user \
    DB_PASSWORD=tu_contraseña \
    DB_NAME=biblioteca_inteligente
```

### 3️⃣ Desplegar código

```bash
# Opción A: ZIP Deploy
zip -r app.zip . -x "node_modules/*" ".git/*" ".env*"
az webapp deployment source config-zip \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente \
  --src app.zip

# Opción B: Git Push
git add .
git commit -m "Deploy to Azure"
git push azure main
```

### 4️⃣ Verificar

```bash
# Ver logs
az webapp log tail --resource-group biblioteca-rg --name bibliotecainteligente

# Probar API
curl https://bibliotecainteligente.azurewebsites.net/api/health
```

---

## 📖 Documentación Completa

📄 **Archivo:** `AZURE_LINUX_DEPLOYMENT.md`

Contiene:
- ✅ Guía paso a paso completa
- ✅ Configuración detallada
- ✅ Troubleshooting
- ✅ Monitoreo y alertas
- ✅ Seguridad en producción

---

## 🏗️ Arquitectura DDD

### 4 Capas Independientes

```
src/
├── presentation/          ← Rutas HTTP (REST)
├── application/           ← Casos de Uso / Servicios
├── domain/                ← Entidades / Reglas de Negocio
└── infrastructure/        ← Base de Datos / Conexiones
```

**Boot Process:**
1. `boot.server.js` - Inicializa Express
2. Carga middleware (CORS, JSON)
3. Importa `src/presentation` (rutas)
4. Las rutas usan `src/application` (servicios)
5. Los servicios usan `src/domain` (validaciones)
6. Y `src/infrastructure` (BD)

---

## 🔧 Archivo Principal

### `boot.server.js`

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Azure usa 8080

// Middleware
app.use(cors());
app.use(express.json());

// Rutas (desde src/presentation)
app.use('/api/users', require('./src/presentation'));

// Health check
app.get('/api/health', (req, res) => 
  res.json({ status: 'OK' })
);

// Iniciar
app.listen(PORT, '0.0.0.0', () => 
  console.log(`✓ Servidor en puerto ${PORT}`)
);
```

**Todo lo demás está en `src/` con DDD**

---

## 📦 Dependencias

```json
{
  "express": "API REST",
  "cors": "Cross-origin",
  "mysql2": "Base de datos",
  "bcryptjs": "Hashing de contraseñas",
  "dotenv": "Variables de entorno"
}
```

---

## 🌍 Endpoints

| Método | Ruta | Función |
|--------|------|---------|
| GET | `/api/health` | Verificar que API funciona |
| POST | `/api/users/register` | Registrar usuario |
| POST | `/api/users/login` | Login |
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Usuario por ID |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

---

## ✅ Checklist

- [x] Estructura DDD en `src/`
- [x] `boot.server.js` escucha en `0.0.0.0:8080`
- [x] Variables de entorno desde `.env`
- [x] Conexión MySQL con pool
- [x] Validaciones en Domain
- [x] Servicios en Application
- [x] Rutas en Presentation
- [x] Documentación Azure Linux

---

## 📚 Archivos a Mantener

```
✓ boot.server.js           - Necesario
✓ src/                     - Necesario
✓ package.json             - Necesario
✓ .env.example             - Para referencia
✓ .gitignore               - Para Git
✓ README.md                - Descripción del proyecto
✓ Dockerfile.azure         - Para Docker (opcional)
✓ AZURE_LINUX_DEPLOYMENT.md - Guía de despliegue
```

---

## 🗑️ Archivos Obsoletos Removidos

```
✗ web.config              - Solo para IIS Windows
✗ .deployment             - Solo para IIS Windows
✗ deploy.cmd              - Solo para Windows
✗ process.json            - Solo para Windows
✗ iisnode.yml             - Solo para IIS
✗ WINDOWS_DEPLOYMENT.md   - Para Windows
✗ WSL_SETUP.md            - Para WSL
✗ QUICK_START.md          - Desactualizado
✗ DEPLOYMENT_SUMMARY.md   - Desactualizado
```

---

## 🚀 Próximos Pasos

1. **Configura Azure Portal:**
   - Crea grupos de recursos
   - Crea App Service plan
   - Crea Web App

2. **Configura variables de entorno:**
   - BD correcta en Azure Portal
   - NODE_ENV=production
   - PORT=8080

3. **Despliega:**
   - ZIP Deploy o Git Push
   - Espera 2-3 minutos
   - Verifica logs

4. **Prueba:**
   - Accede a `/api/health`
   - Prueba endpoints principales
   - Verifica BD

---

## 💡 Tips

- **Logs:** `az webapp log tail --resource-group biblioteca-rg --name bibliotecainteligente`
- **Reiniciar:** `az webapp restart --resource-group biblioteca-rg --name bibliotecainteligente`
- **SSH:** Desde Azure Portal → SSH en tu App Service
- **Monitoreo:** Application Insights automático

---

## 🆘 Problema Común

**"The resource you are looking for has been removed"**

Solución:
```bash
# 1. Ver logs
az webapp log tail --resource-group biblioteca-rg --name bibliotecainteligente

# 2. Verifica variables de entorno
az webapp config appsettings list --resource-group biblioteca-rg --name bibliotecainteligente

# 3. Reinicia
az webapp restart --resource-group biblioteca-rg --name bibliotecainteligente

# 4. Redeploy
az webapp deployment source config-zip \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente \
  --src app.zip
```

---

## 📞 Soporte

Revisa: `AZURE_LINUX_DEPLOYMENT.md` para guía completa

---

**Estado:** ✅ Listo para Azure Linux
**Arquitectura:** ✅ DDD Implementada
**Punto de Entrada:** ✅ boot.server.js
**Plataforma:** ✅ Node.js 18 + Azure App Service
