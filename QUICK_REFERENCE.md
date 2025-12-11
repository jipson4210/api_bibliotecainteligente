# 🚀 Quick Reference - Azure Linux Deployment

## 📁 Archivo Principal
```
boot.server.js  (2.5 KB)
  ↓ Carga
src/presentation/  (Rutas HTTP)
  ↓ Utiliza
src/application/  (Servicios)
  ↓ Utiliza
src/domain/  (Validaciones)
  ↓ Utiliza
src/infrastructure/  (Base de datos)
```

## 🎯 Punto de Entrada

**boot.server.js:**
- Puerto: `8080` (configurado en `PORT` env var)
- Interfaz: `0.0.0.0` (escucha en todas las interfaces)
- Modo: Production por defecto

```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Servidor corriendo en puerto ${PORT}`);
});
```

## 🔧 Variables de Entorno (.env)

```env
# Servidor
PORT=8080
NODE_ENV=production

# Base de Datos
DB_HOST=mysql-biblioteca-utm.mysql.database.azure.com
DB_PORT=3306
DB_USER=biblioteca_user
DB_PASSWORD=tu_contraseña
DB_NAME=biblioteca_inteligente
```

## 📦 Dependencias Principales

| Paquete | Versión | Uso |
|---------|---------|-----|
| express | 4.18.2 | Framework web |
| mysql2 | 3.6.0 | Driver MySQL |
| cors | 2.8.5 | Cross-origin |
| bcryptjs | 3.0.3 | Hashing |
| dotenv | 16.0.3 | Variables env |

## 🚀 Comandos Azure

### 1. Crear Recursos
```bash
az group create --name biblioteca-rg --location eastus

az appservice plan create \
  --name biblioteca-plan \
  --resource-group biblioteca-rg \
  --is-linux \
  --sku B1

az webapp create \
  --resource-group biblioteca-rg \
  --plan biblioteca-plan \
  --name bibliotecainteligente \
  --runtime "node|18"
```

### 2. Configurar Variables
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

### 3. Desplegar ZIP
```bash
zip -r app.zip . -x "node_modules/*" ".git/*" ".env*"

az webapp deployment source config-zip \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente \
  --src app.zip
```

### 4. Ver Logs
```bash
az webapp log tail --resource-group biblioteca-rg --name bibliotecainteligente
```

### 5. Reiniciar App
```bash
az webapp restart --resource-group biblioteca-rg --name bibliotecainteligente
```

## 📡 Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Usuario por ID |
| POST | `/api/users/register` | Registrar |
| POST | `/api/users/login` | Login |
| PUT | `/api/users/:id` | Actualizar |
| DELETE | `/api/users/:id` | Eliminar |

## 🧪 Probar Localmente

```bash
# Terminal 1: Iniciar servidor
PORT=8080 npm start

# Terminal 2: Probar
curl http://localhost:8080/api/health

# Resultado esperado:
# {"status":"API funcionando correctamente","timestamp":"..."}
```

## �� Troubleshooting

| Problema | Solución |
|----------|----------|
| "App not found" | Verifica APP NAME en Azure Portal |
| "Cannot connect DB" | Verifica firewall MySQL en Azure |
| "PORT already in use" | Azure asigna port automáticamente |
| "Module not found" | Ejecuta `npm install` después de desplegar |
| "500 error" | Verifica logs: `az webapp log tail ...` |

## 📋 Estructura DDD Explicada

### Presentation Layer (`src/presentation/`)
- **Qué:** Rutas HTTP y controladores
- **Archivo:** `presentation.UserController.js`
- **Responsabilidad:** Recibir requests, validar entrada, llamar servicios

### Application Layer (`src/application/`)
- **Qué:** Casos de uso y servicios
- **Archivo:** `application.UserService.js`
- **Responsabilidad:** Lógica de negocio, orquestación

### Domain Layer (`src/domain/`)
- **Qué:** Entidades y reglas
- **Archivo:** `domain.User.js`
- **Responsabilidad:** Validaciones, reglas de negocio

### Infrastructure Layer (`src/infrastructure/`)
- **Qué:** Acceso a BD
- **Archivo:** `infrastructure.Database.js`
- **Responsabilidad:** Pool MySQL, conexiones

## 🎯 Flujo de una Solicitud

```
1. Cliente: POST /api/users/register
     ↓
2. Presentation: UserController recibe request
     ↓
3. Application: UserService.registerUser() procesa
     ↓
4. Domain: User.validate() valida datos
     ↓
5. Infrastructure: Database.query() guarda en MySQL
     ↓
6. Response: JSON con usuario creado
```

## ✅ Checklist Pre-Deploy

- [ ] `.env` está configurado localmente
- [ ] `npm install` ejecutado
- [ ] `npm start` funciona sin errores
- [ ] Endpoints responden: `curl http://localhost:8080/api/health`
- [ ] `src/` tiene las 4 capas DDD
- [ ] `boot.server.js` existe y es ejecutable
- [ ] `package.json` tiene `"main": "boot.server.js"`
- [ ] Variables Azure configuradas en Portal
- [ ] ZIP creado: `zip -r app.zip . -x "node_modules/*" ...`

## 📚 Documentación Completa

- **DEPLOY_SETUP.md** - Resumen ejecutivo
- **AZURE_LINUX_DEPLOYMENT.md** - Guía paso a paso
- **README.md** - Descripción del proyecto
- **init.sql** - Script SQL

## 🆘 Soporte Rápido

1. **Verifica logs:**
   ```bash
   az webapp log tail --resource-group biblioteca-rg --name bibliotecainteligente
   ```

2. **Verifica variables:**
   ```bash
   az webapp config appsettings list --resource-group biblioteca-rg --name bibliotecainteligente
   ```

3. **Redeploy:**
   ```bash
   zip -r app.zip . -x "node_modules/*" ".git/*" ".env*"
   az webapp deployment source config-zip --resource-group biblioteca-rg --name bibliotecainteligente --src app.zip
   ```

---

**Última actualización:** 2025-12-11
**Plataforma:** Azure App Service (Linux)
**Runtime:** Node.js 18
**Arquitectura:** DDD
