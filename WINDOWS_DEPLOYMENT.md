# Guía de Deployment en Windows/Azure

## Requisitos Previos

1. **Node.js y npm** instalados en el servidor Windows
2. **IIS** con módulo **iisnode** instalado
3. **URL Rewrite module** para IIS
4. Credenciales de conexión a la base de datos MySQL en Azure

## Archivos de Configuración

### `web.config`
Archivo de configuración de IIS que:
- Define cómo iisnode ejecuta la aplicación Node.js
- Configura reglas de reescritura de URLs
- Maneja compresión gzip
- Agrega headers de seguridad
- Mapea las solicitudes HTTP a `boot.server.js`

### `deploy.cmd`
Script batch ejecutado automáticamente por Azure durante el deployment:
- Limpia dependencias previas (opcional)
- Instala dependencias de producción con npm
- Maneja errores y reporta estado

### `iisnode.yml`
Configuración específica de iisnode:
- Habilita logging para debugging
- Configura límites de proceso
- Define comportamiento de reciclaje de aplicación

## Variables de Entorno (Azure Portal)

En Azure App Service → Configuration → Application settings, agregar:

```
NODE_ENV                 = production
PORT                     = 3000
DB_HOST                  = mysql-biblioteca-utm.mysql.database.azure.com
DB_PORT                  = 3306
DB_USER                  = biblioteca_user@mysql-biblioteca-utm
DB_PASSWORD              = {tu_contraseña_segura}
DB_NAME                  = biblioteca_inteligente
WEBSITE_TIME_ZONE        = America/Guayaquil
```

## Proceso de Deployment

1. **Push a repositorio** (Git/GitHub)
2. **Azure detecta cambios** y ejecuta `deploy.cmd`
3. **npm install --production** instala dependencias
4. **iisnode inicia** la aplicación automáticamente
5. **Servidor responde** en https://bibliotecainteligente.azurewebsites.net

## Testing del Deployment

```bash
# Health check endpoint
curl https://bibliotecainteligente.azurewebsites.net/api/health

# Debería responder:
# {"status":"API funcionando correctamente","timestamp":"...","environment":"production"}
```

## Troubleshooting

### Ver logs
Azure Portal → App Service → Diagnose and solve problems → Application logs

### Errores comunes

- **500 Internal Server Error**: Revisar logs de iisnode en `LogFiles\iisnode\`
- **npm install falla**: Verificar versión de Node.js instalada en Azure
- **No puede conectar BD**: Verificar credenciales y firewall de MySQL

## Notas

- iisnode recicla automáticamente la aplicación si `.js` cambia
- La aplicación escucha en `0.0.0.0:3000` pero IIS la expone en HTTPS
- Los logs están en `D:\home\site\wwwroot\iisnode\`
