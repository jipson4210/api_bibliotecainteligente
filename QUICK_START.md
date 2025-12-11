# Quick Start - Windows Development

## ¿Primero aquí? Comienza aquí.

### Paso 1: Setup Inicial (una sola vez)
```cmd
setup.cmd
```
Esto:
- Verifica Node.js instalado
- Instala todas las dependencias
- Crea archivo .env

### Paso 2: Edita .env con tus credenciales
```
Abre: .env
Configura: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
```

### Paso 3: Inicia el Servidor
```cmd
start-dev.cmd
```
Servidor corre en: **http://localhost:3000**

### Paso 4: Prueba que funciona
```
Abre navegador: http://localhost:3000/api/health

Deberías ver:
{"status":"API funcionando correctamente",...}
```

---

## Comandos Útiles

```cmd
# Ver versiones instaladas
node --version
npm --version

# Iniciar en desarrollo (con hot reload)
start-dev.cmd

# Iniciar en producción
npm start

# Instalar dependencias nuevas
npm install nombre_paquete

# Ver problemas
troubleshoot.cmd
```

---

## Si Algo No Funciona

1. **"npm is not recognized"**
   - Instala Node.js: https://nodejs.org/
   - Reinicia la terminal

2. **"Port 3000 already in use"**
   - Edita .env y cambia PORT=3001 (o 3002, 3003...)

3. **"Cannot find database"**
   - Verifica credenciales en .env
   - Asegúrate que BD es accesible

4. **Algo más**
   - Ejecuta: `troubleshoot.cmd`

---

## Estructura del Proyecto

```
api_bibliotecainteligente/
├── boot.server.js          ← Punto de entrada
├── package.json            ← Dependencias
├── .env                    ← Variables (local, no subir)
├── .env.example            ← Template
├── web.config              ← Configuración IIS
├── iisnode.yml             ← Configuración iisnode
├── deploy.cmd              ← Deployment (Azure)
├── setup.cmd               ← Setup inicial
├── start-dev.cmd           ← Servidor desarrollo
├── troubleshoot.cmd        ← Diagnostico
└── src/
    ├── domain/             ← Entidades
    ├── application/        ← Casos de uso
    ├── presentation/       ← Controladores
    └── infrastructure/     ← BD
```

---

## Endpoints Disponibles

- `GET /api/health` - Verificar que API funciona
- `GET/POST /api/users` - Gestión de usuarios

---

## Deployment a Azure

1. Edita `.env` con credenciales Azure
2. Haz commit: `git add . && git commit -m "Changes"`
3. Push: `git push`
4. ¡Listo! Azure deploya automáticamente

Ver progreso: Azure Portal → Deployment Center

---

## Más Información

- [WINDOWS_DEPLOYMENT.md](WINDOWS_DEPLOYMENT.md) - Guía completa Windows/Azure
- [SCRIPTS.md](SCRIPTS.md) - Descripción detallada de cada script
- [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - Resumen técnico

---

**¿Preguntas?** Revisa los archivos .md o ejecuta `troubleshoot.cmd`
