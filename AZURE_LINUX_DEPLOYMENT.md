# 🚀 Guía de Despliegue en Azure App Service (Linux)

**Biblioteca Inteligente API** - Arquitectura DDD

---

## 📁 Estructura del Proyecto

```
api_bibliotecainteligente/
├── boot.server.js              ← Punto de entrada principal
├── package.json
├── .env                        ← Variables de entorno
│
├── src/
│   ├── domain/                 ← Capa de Dominio (Entidades)
│   │   ├── index.js
│   │   └── domain.User.js
│   │
│   ├── application/            ← Capa de Aplicación (Casos de Uso)
│   │   ├── index.js
│   │   └── application.UserService.js
│   │
│   ├── presentation/           ← Capa de Presentación (Controladores)
│   │   ├── index.js
│   │   └── presentation.UserController.js
│   │
│   └── infrastructure/         ← Capa de Infraestructura (BD)
│       ├── index.js
│       └── infrastructure.Database.js
│
├── Dockerfile.azure
├── .github/workflows/azure-deploy.yml
└── AZURE_LINUX_DEPLOYMENT.md   ← Este archivo
```

### 🎯 Punto de Entrada

**`boot.server.js`** - Inicializa la aplicación:
- Configura Express
- Carga middleware (CORS, JSON)
- Monta rutas desde `src/presentation`
- Escucha en puerto `8080` en interfaz `0.0.0.0`

---

## 🔧 Requisitos Previos

- ✅ Cuenta de Azure activa
- ✅ Azure CLI instalado (`az --version`)
- ✅ Git configurado
- ✅ Repositorio en GitHub o Azure Repos

---

## 📋 Paso 1: Preparar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=8080
NODE_ENV=production

# Base de Datos MySQL en Azure
DB_HOST=mysql-biblioteca-utm.mysql.database.azure.com
DB_PORT=3306
DB_USER=biblioteca_user
DB_PASSWORD=tu_contraseña_segura_aqui
DB_NAME=biblioteca_inteligente
```

**⚠️ IMPORTANTE:**
- No subas `.env` a Git
- Usa `.env.example` como plantilla
- Las variables se configuram en Azure Portal

---

## 🏗️ Paso 2: Crear Grupo de Recursos en Azure

```bash
# Reemplaza <grupo-recursos> con un nombre único
az group create \
  --name biblioteca-rg \
  --location eastus
```

---

## 🌐 Paso 3: Crear App Service Plan (Linux)

```bash
# Plan Basic (desarrollo)
az appservice plan create \
  --name biblioteca-plan \
  --resource-group biblioteca-rg \
  --is-linux \
  --sku B1
```

**Planes disponibles:**
- `B1` - Basic (desarrollo) - $0.012/hora
- `B2` - Basic (producción) - $0.024/hora
- `S1` - Standard (recomendado) - $0.10/hora

---

## 🚀 Paso 4: Crear Web App (Node.js)

```bash
az webapp create \
  --resource-group biblioteca-rg \
  --plan biblioteca-plan \
  --name bibliotecainteligente \
  --runtime "node|18"
```

**Verifica:**
```bash
# URL de tu aplicación
echo "https://bibliotecainteligente.azurewebsites.net"
```

---

## ⚙️ Paso 5: Configurar Variables de Entorno en Azure

### Opción A: Desde Azure CLI

```bash
az webapp config appsettings set \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    DB_HOST=mysql-biblioteca-utm.mysql.database.azure.com \
    DB_PORT=3306 \
    DB_USER=biblioteca_user \
    DB_PASSWORD=tu_contraseña_segura_aqui \
    DB_NAME=biblioteca_inteligente
```

### Opción B: Desde Azure Portal

1. Abre [Azure Portal](https://portal.azure.com)
2. Busca tu App Service: **bibliotecainteligente**
3. Ve a **Configuration** → **Application settings**
4. Haz clic en **+ New application setting** para cada variable:
   - `NODE_ENV` → `production`
   - `PORT` → `8080`
   - `DB_HOST` → tu servidor MySQL
   - `DB_USER` → `biblioteca_user`
   - `DB_PASSWORD` → tu contraseña
   - `DB_NAME` → `biblioteca_inteligente`
5. Haz clic en **Save**

---

## 📦 Paso 6: Desplegar la Aplicación

### Opción A: Git Deploy (Automático)

```bash
# 1. Configura la URL de despliegue Git
cd /home/josemontalban/Desarrollo/api_bibliotecainteligente

# 2. Agrega el remoto de Azure
az webapp deployment source config-local-git \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente

# 3. Commit y push
git add .
git commit -m "Deployment to Azure Linux"
git push azure main
```

### Opción B: ZIP Deploy

```bash
# 1. Crea un ZIP (excluir node_modules)
zip -r app.zip . \
  -x "node_modules/*" \
  ".git/*" \
  ".env*" \
  "*.log"

# 2. Despliega
az webapp deployment source config-zip \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente \
  --src app.zip
```

### Opción C: GitHub Actions (CI/CD)

1. Sube `.github/workflows/azure-deploy.yml` a tu repo
2. Ve a GitHub → Settings → Secrets and variables → Actions
3. Agrega `AZURE_WEBAPP_PUBLISH_PROFILE`:
   ```bash
   az webapp deployment list-publishing-profiles \
     --resource-group biblioteca-rg \
     --name bibliotecainteligente \
     --xml
   ```
4. Copia el contenido y agrégalo como secret
5. Push a `main` para disparar el workflow

---

## ✅ Paso 7: Verificar Despliegue

### Ver logs en tiempo real

```bash
az webapp log tail \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente
```

Deberías ver:
```
✓ Controlador cargado correctamente
✓ Servidor corriendo en puerto 8080
✓ Endpoints disponibles:
  - GET  /api/health
  - GET  /api/users
  - POST /api/users/register
```

### Probar endpoints

```bash
# Health check
curl https://bibliotecainteligente.azurewebsites.net/api/health

# Listar usuarios
curl https://bibliotecainteligente.azurewebsites.net/api/users

# Registrar usuario
curl -X POST https://bibliotecainteligente.azurewebsites.net/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "correoElectronico": "juan@ejemplo.com",
    "numeroCelular": "3215551234",
    "fechaNacimiento": "1990-05-15",
    "contrasena": "Segura123!"
  }'
```

---

## 🔗 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Verifica que el API funciona |
| GET | `/api/users` | Lista todos los usuarios |
| GET | `/api/users/:id` | Obtiene usuario por ID |
| POST | `/api/users/register` | Registra un nuevo usuario |
| POST | `/api/users/login` | Login de usuario |
| PUT | `/api/users/:id` | Actualiza un usuario |
| DELETE | `/api/users/:id` | Elimina un usuario |
| POST | `/api/users/check-email` | Verifica disponibilidad de email |

---

## 🔍 Troubleshooting

### Error: "The resource you are looking for has been removed"

1. **Verifica logs:**
   ```bash
   az webapp log tail --resource-group biblioteca-rg --name bibliotecainteligente
   ```

2. **Reinicia la app:**
   ```bash
   az webapp restart --resource-group biblioteca-rg --name bibliotecainteligente
   ```

3. **Verifica variables de entorno:**
   ```bash
   az webapp config appsettings list \
     --resource-group biblioteca-rg \
     --name bibliotecainteligente
   ```

### Error: "Cannot connect to database"

1. **Verifica que MySQL está activo:**
   ```bash
   az mysql flexible-server show \
     --resource-group biblioteca-rg \
     --name mysql-biblioteca-utm
   ```

2. **Verifica credenciales en Azure Portal:**
   - Configuration → Application settings
   - Confirma `DB_HOST`, `DB_USER`, `DB_PASSWORD`

3. **Verifica firewall de MySQL:**
   ```bash
   az mysql flexible-server firewall-rule list \
     --resource-group biblioteca-rg \
     --server-name mysql-biblioteca-utm
   ```

### Error: "Port already in use"

Azure asigna automáticamente el puerto. La variable `PORT=8080` es solo para referencia interna.

---

## 📊 Monitoreo

### Ver métricas en Azure Portal

1. Ve a tu App Service
2. **Metrics** → Selecciona:
   - CPU Percentage
   - Memory Percentage
   - HTTP 2xx/4xx/5xx

### Configurar alertas

```bash
az monitor metrics alert create \
  --name cpu-alert \
  --resource-group biblioteca-rg \
  --scopes /subscriptions/{subscription-id}/resourceGroups/biblioteca-rg/providers/Microsoft.Web/sites/bibliotecainteligente \
  --condition "avg Percentage CPU > 80" \
  --window-size 5m \
  --evaluation-frequency 1m
```

---

## 🎯 Arquitectura DDD en Azure

Tu proyecto usa **Domain-Driven Design** con 4 capas:

```
┌─────────────────────────────────────────────────────┐
│  PRESENTATION (src/presentation/)                   │
│  └─ Rutas HTTP / Controladores                      │
├─────────────────────────────────────────────────────┤
│  APPLICATION (src/application/)                     │
│  └─ Casos de uso / Servicios                        │
├─────────────────────────────────────────────────────┤
│  DOMAIN (src/domain/)                               │
│  └─ Entidades / Reglas de negocio                   │
├─────────────────────────────────────────────────────┤
│  INFRASTRUCTURE (src/infrastructure/)               │
│  └─ Base de datos / Conexiones externas             │
└─────────────────────────────────────────────────────┘
```

**boot.server.js** es solo un inicializador que monta todo en Express.

---

## 🔐 Seguridad

### En Producción

- ✅ `NODE_ENV=production`
- ✅ Usa HTTPS (Azure proporciona automáticamente)
- ✅ Credenciales en Azure Key Vault (no en código)
- ✅ Firewall restringido en MySQL
- ✅ CORS configurado para dominios específicos

### Ejemplo de CORS seguro

Edita `boot.server.js` para producción:

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://tu-dominio.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};
app.use(cors(corsOptions));
```

---

## 💰 Costos Estimados

| Recurso | Plan | Costo |
|---------|------|-------|
| App Service | B1 (Linux) | $0.012/hora |
| MySQL | Basic | $30/mes |
| **Total** | **Dev** | **~$55/mes** |

---

## 📚 Recursos Útiles

- [Azure App Service Documentation](https://learn.microsoft.com/en-us/azure/app-service/)
- [Azure CLI Reference](https://learn.microsoft.com/en-us/cli/azure/)
- [Node.js on Azure](https://azure.microsoft.com/en-us/products/app-service/web/)
- [GitHub Actions for Azure](https://github.com/azure/webapps-deploy)

---

## 🎉 ¡Listo!

Tu API está disponible en:

```
https://bibliotecainteligente.azurewebsites.net/api/health
```

**Próximos pasos:**
- ✅ Configura dominio personalizado
- ✅ Habilita SSL/TLS automático
- ✅ Configura backups automáticos
- ✅ Monitorea métricas y logs

---

**Creado para:** Biblioteca Inteligente API
**Arquitectura:** Domain-Driven Design (DDD)
**Plataforma:** Azure App Service (Linux)
**Runtime:** Node.js 18 LTS
