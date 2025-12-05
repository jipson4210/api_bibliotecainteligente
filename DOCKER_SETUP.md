# 🐳 Configuración Docker - Biblioteca Inteligente API

## 📋 Descripción

Se ha configurado Docker Compose para levantar la API con MySQL automáticamente. Incluye:

- **Motor de Base de Datos**: MySQL 8.0
- **Usuario**: `biblioteca_user`
- **Contraseña**: `biblioteca_pass_123`
- **Base de Datos**: `biblioteca_inteligente`
- **Tabla**: `usuarios` (con campos: id, nombre, apellido, correoElectronico, numeroCelular, fechaNacimiento)

## 🚀 Requisitos

- Docker Desktop instalado
- Docker Compose incluido (viene con Docker Desktop)

## 📝 Pasos para usar

### 1. Clonar o descargar el proyecto

```bash
cd /ruta/del/proyecto
```

### 2. Levantar los servicios (MySQL + API)

```bash
docker-compose up -d
```

Esto creará:
- Contenedor `biblioteca-mysql` (Puerto 3306)
- Contenedor `biblioteca-api` (Puerto 3000)

### 3. Verificar que todo está corriendo

```bash
docker-compose ps
```

### 4. Ver logs de los servicios

```bash
# Logs de todos los servicios
docker-compose logs -f

# Logs solo de la API
docker-compose logs -f api

# Logs solo de MySQL
docker-compose logs -f mysql
```

## 🔌 Acceso a la Base de Datos

Desde tu cliente MySQL o aplicación:

```
Host: localhost
Puerto: 3306
Usuario: biblioteca_user
Contraseña: biblioteca_pass_123
Base de Datos: biblioteca_inteligente
```

### Con MySQL CLI:
```bash
mysql -h localhost -u biblioteca_user -p biblioteca_inteligente
# Contraseña: biblioteca_pass_123
```

### Con MySQL Workbench:
1. Nueva conexión
2. Hostname: `localhost`
3. Port: `3306`
4. Username: `biblioteca_user`
5. Password: `biblioteca_pass_123`

## 📊 Tabla de usuarios

Se crea automáticamente con la estructura:

```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correoElectronico VARCHAR(255) NOT NULL UNIQUE,
  numeroCelular VARCHAR(20) NOT NULL,
  fechaNacimiento DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

## 🛑 Detener los servicios

```bash
docker-compose down
```

Para eliminar también los datos de la BD (volumen):
```bash
docker-compose down -v
```

## 📁 Estructura Docker

- **docker-compose.yml**: Orquesta los dos servicios (MySQL y API)
- **Dockerfile**: Define la imagen de la API Node.js
- **init.sql**: Script SQL que se ejecuta automáticamente al iniciar MySQL
- **.env.example**: Configuración de variables de entorno

## ⚙️ Variables de entorno

Se definen automáticamente en el `docker-compose.yml`. Si necesitas modificarlas, edita:

```yaml
environment:
  DB_HOST: mysql
  DB_USER: biblioteca_user
  DB_PASSWORD: biblioteca_pass_123
  DB_NAME: biblioteca_inteligente
```

## 🔧 Solución de problemas

### Puerto 3306 ya está en uso:
```bash
# En docker-compose.yml, cambia:
ports:
  - "3307:3306"  # Usa 3307 en localhost
```

### Puerto 3000 ya está en uso:
```bash
# En docker-compose.yml, cambia:
ports:
  - "3001:3000"  # Usa 3001 en localhost
```

### MySQL no inicia correctamente:
```bash
docker-compose logs mysql
docker-compose restart mysql
```

### Conectar a MySQL dentro del contenedor:
```bash
docker exec -it biblioteca-mysql mysql -u biblioteca_user -p biblioteca_inteligente
# Contraseña: biblioteca_pass_123
```

## 📡 Endpoints API

La API estará disponible en: `http://localhost:3000`

Verifica que la conexión a BD funciona revisando los logs:
```bash
docker-compose logs api
```
