# Azure App Service Configuration
# Estos valores deben configurarse en Azure Portal → App Service → Configuration

## Application Settings (variables de entorno)

NODE_ENV=production
PORT=3000

# MySQL Database Configuration for Azure
# IMPORTANTE: Usar el nombre completo del servidor MySQL en Azure
DB_HOST=mysql-biblioteca-utm.mysql.database.azure.com
DB_PORT=3306
DB_USER=biblioteca_user@mysql-biblioteca-utm
DB_PASSWORD={SECURE_PASSWORD_HERE}
DB_NAME=biblioteca_inteligente

# Connection Pool Settings (opcional)
DB_CONNECTIONLIMIT=10
DB_WAITFORCONNECTIONS=true
DB_QUEUELIMIT=0

# Security Headers
X_FRAME_OPTIONS=DENY
X_CONTENT_TYPE_OPTIONS=nosniff

## App Service Plan

- Runtime Stack: Node.js 22
- Operating System: Windows
- Region: East US (o tu región preferida)

## Startup Command (no necesario, iisnode maneja esto)

# Dejarlo vacío, iisnode inicia automáticamente boot.server.js

## Handler Mappings (configurado en web.config)

- Extension: *.js
- Handler: iisnode

## Important Notes for Azure Deployment

1. **iisnode debe estar instalado** en el servidor de Azure App Service
   - Azure instala iisnode automáticamente para aplicaciones Node.js

2. **URL Rewrite Module** necesario
   - También instalado automáticamente por Azure

3. **MySQL Connection**
   - Azure MySQL requiere nombre completo: usuario@servidor
   - Ejemplo: biblioteca_user@mysql-biblioteca-utm
   - Firewall: Permitir acceso desde Azure

4. **SSL/TLS**
   - Azure proporciona certificado HTTPS automáticamente
   - IIS gestiona la redirección HTTP → HTTPS

5. **Logs**
   - Ver en: Azure Portal → Diagnose and solve problems
   - Logs locales: D:\home\site\wwwroot\iisnode\

6. **Health Check**
   - Endpoint: https://bibliotecainteligente.azurewebsites.net/api/health
   - Respuesta esperada: {"status":"API funcionando correctamente",...}

## Deployment Process

1. Push a GitHub/repositorio remoto
2. Azure App Service detecta cambios (continuous deployment)
3. Ejecuta deploy.cmd automáticamente
4. npm install --production instala dependencias
5. iisnode inicia la aplicación
6. Servidor responde a requests HTTPS
