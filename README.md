# API Biblioteca Inteligente

## 📚 Descripción

API Backend para el sistema de registro de usuarios de **Biblioteca Inteligente**. Desarrollado con arquitectura **DDD (Domain-Driven Design)** utilizando Node.js, Express y MySQL.

---

## 👥 Autores

- **Jipson Montalban**
- **Jonathan Zambrano**

---

## 🏗️ Arquitectura DDD

```
api_bibliotecainteligente/
├── src/
│   ├── domain/              # Capa de Dominio (Entidades)
│   │   ├── index.js
│   │   └── domain.User.js
│   │
│   ├── application/         # Capa de Aplicación (Casos de Uso)
│   │   ├── index.js
│   │   └── application.UserService.js
│   │
│   ├── presentation/        # Capa de Presentación (Rutas)
│   │   ├── index.js
│   │   └── presentation.UserController.js
│   │
│   └── infrastructure/      # Capa de Infraestructura (BD)
│       ├── index.js
│       └── infrastructure.Database.js
│
├── boot.server.js           # Punto de entrada
├── package.json
├── .env
└── README.md
```

---

## 🚀 Instalación y Uso

### Requisitos Previos

- Node.js 16+ ([Descargar](https://nodejs.org/))
- npm 8+
- MySQL 5.7+ ([Descargar](https://www.mysql.com/downloads/))

### Pasos de Instalación

1. **Instalar dependencias:**
```bash
cd api_bibliotecainteligente
npm install
```

2. **Configurar variables de entorno:**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DB_HOST=localhost
DB_USER=biblioteca_user
DB_PASSWORD=biblioteca_password
DB_NAME=biblioteca_inteligente

# Servidor
PORT=3000
NODE_ENV=development
```

3. **Crear la base de datos:**

```sql
CREATE DATABASE biblioteca_inteligente;

USE biblioteca_inteligente;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correoElectronico VARCHAR(100) UNIQUE NOT NULL,
  numeroCelular VARCHAR(20) NOT NULL,
  fechaNacimiento DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. **Iniciar el servidor:**

```bash
npm run dev
```

Verás:
```
✓ Servidor corriendo en http://localhost:3000
```

---

## 📋 Endpoints API

### 1. Registrar Usuario

**POST** `/api/users/register`

**Request:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correoElectronico": "juan@ejemplo.com",
  "numeroCelular": "3215551234",
  "fechaNacimiento": "1990-05-15"
}
```

**Response (201):**
```json
{
  "message": "¡Registro exitoso! Bienvenido a Biblioteca Inteligente.",
  "user": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correoElectronico": "juan@ejemplo.com",
    "numeroCelular": "3215551234",
    "fechaNacimiento": "1990-05-15"
  }
}
```

### 2. Obtener Todos los Usuarios

**GET** `/api/users`

**Response (200):**
```json
{
  "total": 5,
  "users": [
    {
      "id": 1,
      "nombre": "Juan",
      "apellido": "Pérez",
      ...
    }
  ]
}
```

### 3. Obtener Usuario por ID

**GET** `/api/users/:id`

**Response (200):**
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  ...
}
```

### 4. Actualizar Usuario

**PUT** `/api/users/:id`

**Request:**
```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  ...
}
```

**Response (200):**
```json
{
  "message": "Usuario actualizado correctamente",
  "user": { ... }
}
```

### 5. Eliminar Usuario

**DELETE** `/api/users/:id`

**Response (200):**
```json
{
  "message": "Usuario eliminado correctamente"
}
```

### 6. Verificar Disponibilidad de Email

**POST** `/api/users/check-email`

**Request:**
```json
{
  "email": "nuevo@ejemplo.com"
}
```

**Response (200):**
```json
{
  "email": "nuevo@ejemplo.com",
  "available": true
}
```

---

## 🔧 Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Node.js | 16+ | Runtime |
| Express | 4.x | Framework Web |
| MySQL | 5.7+ | Base de Datos |
| mysql2 | 3.x | Driver MySQL |
| dotenv | 16.x | Variables de Entorno |

---

## 📁 Estructura de Carpetas

```
api_bibliotecainteligente/
├── src/
│   ├── domain/
│   │   ├── index.js
│   │   └── domain.User.js           # Entidad Usuario
│   │
│   ├── application/
│   │   ├── index.js
│   │   └── application.UserService.js # Lógica de Negocio
│   │
│   ├── presentation/
│   │   ├── index.js
│   │   └── presentation.UserController.js # Rutas HTTP
│   │
│   └── infrastructure/
│       ├── index.js
│       └── infrastructure.Database.js # Conexión MySQL
│
├── boot.server.js                    # Entrada Principal
├── package.json                      # Dependencias
├── .env                              # Configuración
├── .env.example                      # Plantilla .env
├── README.md                         # Este archivo
└── init.sql                          # SQL Inicial
```

---

## 🎯 Patrones Implementados

### 1. Domain-Driven Design (DDD)

Estructura clara con 4 capas:
- **Domain**: Reglas de negocio y validaciones
- **Application**: Casos de uso y servicios
- **Presentation**: Rutas y controladores
- **Infrastructure**: Acceso a datos

### 2. Validaciones

- ✅ Validación de formato de email
- ✅ Validación de campos requeridos
- ✅ Validación de edad mínima
- ✅ Validación de duplicados (email único)

### 3. Manejo de Errores

- Errores con códigos HTTP apropiados
- Mensajes claros en español
- Validación dual (cliente + servidor)

---

## 📝 Códigos de Estado HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Éxito |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Error en validación |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Email ya registrado |
| 500 | Server Error - Error del servidor |

---

## 🐛 Solución de Problemas

### Error: Cannot find module

**Solución**: Asegúrate de estar en la carpeta correcta y que `node_modules` existe:
```bash
npm install
```

### Error: ECONNREFUSED (Base de datos)

**Solución**: Verifica que MySQL está corriendo:
```bash
# Windows: Ver servicios
net start MySQL80

# Linux
sudo service mysql start
```

### Error: Access Denied for user

**Solución**: Verifica credenciales en `.env`:
```env
DB_USER=tu_usuario
DB_PASSWORD=tu_password
```

---

## 🚀 Despliegue

### En Producción Local

1. Actualiza `.env` con credenciales de producción
2. Usa variable `NODE_ENV=production`
3. Configura Puerto (recomendado: 3000 o superior)

```bash
NODE_ENV=production npm start
```

### 🌐 Despliegue en Azure App Service

Para desplegar en Azure App Service, consulta el archivo [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) que contiene:

- Requisitos previos
- Pasos de configuración en Azure
- Métodos de deployment (Git o ZIP)
- Configuración de variables de entorno
- Troubleshooting y monitoreo

**Inicio rápido:**
```bash
# Usar el script de deployment (recomendado)
chmod +x deploy-azure.sh
./deploy-azure.sh

# O seguir los pasos manuales en AZURE_DEPLOYMENT.md
```

---

## 📊 Base de Datos

### Tabla: usuarios

| Campo | Tipo | Descripción |
|-------|------|------------|
| id | INT | ID único (PK) |
| nombre | VARCHAR(100) | Nombre del usuario |
| apellido | VARCHAR(100) | Apellido del usuario |
| correoElectronico | VARCHAR(100) | Email único |
| numeroCelular | VARCHAR(20) | Número de teléfono |
| fechaNacimiento | DATE | Fecha de nacimiento |
| createdAt | TIMESTAMP | Fecha de creación |

---

## 📞 Contacto y Soporte

**Autores:**
- Jipson Montalban
- Jonathan Zambrano

**Fecha de Creación:** 25/11/2025

**Versión:** 1.0.0

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos y educativos.

---

## 🎉 Características Principales

✅ API REST completa
✅ Arquitectura DDD
✅ Validaciones duales
✅ Manejo de errores robusto
✅ Documentación clara
✅ Código modular y escalable
✅ Base de datos MySQL integrada

---

**¡Gracias por usar Biblioteca Inteligente!** 📚
