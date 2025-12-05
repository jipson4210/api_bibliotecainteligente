# 🐳 Configuración Docker en WSL - Biblioteca Inteligente API

## ⚠️ Configuración requerida para WSL

### Paso 1: Habilitar Docker en WSL

1. **Abre Docker Desktop** en Windows
2. Ve a **Settings** (Configuración)
3. Selecciona **Resources** (Recursos)
4. En la sección **WSL Integration**, habilita tu distribución WSL
5. Reinicia Docker Desktop

### Paso 2: Verifica que Docker funciona

```bash
docker --version
docker ps
```

Si ves errores, reinicia WSL:
```bash
# En PowerShell (Windows)
wsl --shutdown
```

Luego abre WSL de nuevo.

## 🚀 Usar Docker en WSL

### Opción A: Script automático (recomendado)

```bash
cd /home/josemontalban/Desarrollo/api_bibliotecainteligente
./wsl-docker-setup.sh
```

Selecciona la opción que necesites del menú interactivo.

### Opción B: Comandos manuales

**Levantar servicios:**
```bash
cd /home/josemontalban/Desarrollo/api_bibliotecainteligente
docker-compose up -d
```

**Ver estado:**
```bash
docker-compose ps
```

**Ver logs:**
```bash
docker-compose logs -f
```

**Detener servicios:**
```bash
docker-compose down
```

**Acceder a MySQL:**
```bash
docker exec -it biblioteca-mysql mysql -u biblioteca_user -p biblioteca_inteligente
```
(Contraseña: `biblioteca_pass_123`)

## 📋 Credenciales

- **Usuario BD**: `biblioteca_user`
- **Contraseña BD**: `biblioteca_pass_123`
- **Base de datos**: `biblioteca_inteligente`
- **Host**: `localhost` o `127.0.0.1`
- **Puerto**: `3306`

## 🌐 Acceso a servicios

- **API**: http://localhost:3000
- **MySQL**: localhost:3306

## 🔧 Solución de problemas en WSL

### Error: "Docker daemon is not running"

```bash
# En WSL, ejecuta:
sudo service docker start

# O reinicia WSL desde PowerShell (Windows):
wsl --shutdown
```

### Error: "Permission denied"

```bash
# Añade tu usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Verifica que funciona
docker ps
```

### Los puertos no funcionan desde Windows

En WSL2, los puertos deben estar accesibles. Verifica:

```bash
# En WSL
docker-compose ps

# Debería mostrar los puertos mapeados
PORTS
0.0.0.0:3000->3000/tcp
0.0.0.0:3306->3306/tcp
```

### Volumen de datos no sincroniza

WSL2 puede tener problemas con permisos de archivos. Si ocurre:

```bash
# Detén los servicios
docker-compose down

# Limpia volumen
docker volume rm biblioteca_inteligente_mysql_data

# Levanta de nuevo
docker-compose up -d
```

## 📁 Estructura de archivos en WSL

Tu proyecto está en:
```
\\wsl.localhost\Ubuntu\home\josemontalban\Desarrollo\api_bibliotecainteligente
```

Desde Windows puedes acceder directamente en el Explorador de archivos.

## 💡 Tips para WSL

1. **Rendimiento**: Guarda los archivos en el filesystem de WSL, no en `/mnt/c/` (Windows)
2. **VS Code**: Usa la extensión "Remote - WSL" para mejor integración
3. **Git**: Configura Git en WSL, no en Windows
4. **npm/Docker**: Usa las versiones de WSL, no las de Windows

## 🆘 Más ayuda

Si persisten problemas, verifica los logs:

```bash
# Logs de Docker en WSL
docker-compose logs -f mysql
docker-compose logs -f api

# Info de Docker
docker info

# Versión de Docker
docker --version
docker-compose --version
```
