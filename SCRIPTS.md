# Scripts de Windows para Biblioteca Inteligente API

Este directorio contiene varios scripts batch (.cmd) diseñados para facilitar el desarrollo y deployment en Windows.

## Scripts Disponibles

### 1. **setup.cmd** - Setup Inicial
```cmd
setup.cmd
```
- Verifica Prerequisites (Node.js, npm)
- Instala dependencias del proyecto
- Crea archivo .env si no existe
- **Ejecutar una sola vez** al clonar el proyecto

### 2. **start-dev.cmd** - Desarrollo Local
```cmd
start-dev.cmd
```
- Inicia servidor con **nodemon** (hot reload)
- Carga variables de .env automáticamente
- Perfecto para desarrollo
- Presiona Ctrl+C para detener

### 3. **check-prerequisites.cmd** - Verificar Requisitos
```cmd
check-prerequisites.cmd
```
- Verifica que Node.js y npm estén instalados
- Busca git (opcional)
- Útil para diagnosticar problemas de setup
- Se ejecuta automáticamente en setup.cmd

### 4. **troubleshoot.cmd** - Diagnostico
```cmd
troubleshoot.cmd
```
- Verifica Node.js y npm versions
- Comprueba si node_modules existe
- Verifica web.config y .env
- Intenta iniciar servidor en puerto de prueba
- Muestra puertos en uso

### 5. **deploy.cmd** - Deployment Automático
```cmd
deploy.cmd
```
- **Ejecutado automáticamente por Azure**
- No ejecutar manualmente (solo referencia)
- Instala dependencias de producción
- Valida que npm install haya tenido éxito
- Inicia automáticamente vía iisnode

## Flujo de Trabajo Recomendado

### Desarrollo Local (Windows)

```cmd
REM Primera vez
setup.cmd

REM Cada vez que quieras desarrollar
start-dev.cmd
```

### Deployment a Azure

1. Verifica todo funciona localmente:
   ```cmd
   start-dev.cmd
   ```

2. Haz commit y push a GitHub:
   ```cmd
   git add .
   git commit -m "Changes"
   git push
   ```

3. Azure detecta cambios y ejecuta automáticamente:
   - `deploy.cmd` → instala dependencias
   - `iisnode` → inicia aplicación
   - App responde en https://...azurewebsites.net

### Troubleshooting

Si algo no funciona:

```cmd
troubleshoot.cmd
```

Este script diagnosticará problemas comunes.

## Configuración Requerida

### En el Sistema (primera vez)

1. Instalar [Node.js](https://nodejs.org/) - incluye npm
2. Reiniciar terminal/PowerShell después de instalar

### En el Proyecto (.env)

```cmd
setup.cmd
```
Crea .env automáticamente. Edita con tus credenciales:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=basedatos
```

## Errores Comunes

| Error | Solución |
|-------|----------|
| "npm is not recognized" | Instala Node.js desde nodejs.org |
| "Port 3000 already in use" | Cambia PORT en .env (3001, 3002, etc) |
| "Cannot find module 'express'" | Ejecuta: `npm install` |
| ".env not found" | Ejecuta: `setup.cmd` |
| "Cannot start server in IIS" | Verifica: `troubleshoot.cmd` |

## Notas Importantes

- Los scripts `.cmd` son **solo para Windows**
- En Linux/Mac, usa `npm start`, `npm run dev`, etc.
- Azure App Service maneja automáticamente el deployment
- Los logs en Azure están en: Diagnose and solve problems
- Los logs locales están en: iisnode/ (después de ejecutar)

## Archivos de Configuración

| Archivo | Propósito | Entorno |
|---------|-----------|---------|
| `web.config` | Configuración de IIS | Windows/Azure |
| `iisnode.yml` | Configuración de iisnode | Windows/Azure |
| `.deployment` | Referencia deploy.cmd | Azure |
| `deploy.cmd` | Script de deployment | Azure |
| `.env` | Variables de entorno | Todos |
| `.env.example` | Plantilla de variables | Referencia |
