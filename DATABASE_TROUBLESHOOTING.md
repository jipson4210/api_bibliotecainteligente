# 🔍 Diagnóstico: Error de Conexión a Base de Datos en Azure

## 🚨 Síntoma

```json
{"message":"Error interno del servidor"}
```

Esto generalmente significa que **la aplicación NO puede conectar a la base de datos MySQL en Azure**.

---

## ✅ Checklist de Diagnóstico

### 1️⃣ Verificar Variables de Entorno en Azure Portal

```bash
# Ver todas las variables configuradas
az webapp config appsettings list \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente
```

**Deben existir EXACTAMENTE estas variables:**
```
DB_HOST=mysql-biblioteca-utm.mysql.database.azure.com
DB_PORT=3306
DB_USER=biblioteca_user
DB_PASSWORD=biblioteca_pass_123
DB_NAME=biblioteca_inteligente
NODE_ENV=production
PORT=8080
```

**Si falta alguna:** Agrégala con:
```bash
az webapp config appsettings set \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente \
  --settings DB_HOST=mysql-biblioteca-utm.mysql.database.azure.com
```

---

### 2️⃣ Verificar que MySQL está Activo

```bash
# Ver estado del servidor MySQL
az mysql flexible-server show \
  --resource-group <tu-grupo-recursos> \
  --name mysql-biblioteca-utm
```

**Busca:** `state: "Ready"` (si dice "Stopped", inicia con):
```bash
az mysql flexible-server start \
  --resource-group <tu-grupo-recursos> \
  --name mysql-biblioteca-utm
```

---

### 3️⃣ Verificar Firewall de MySQL

**En Azure Portal:**
1. Ve a tu servidor MySQL: `mysql-biblioteca-utm`
2. Ve a **Networking**
3. Verifica que exista una regla como:
   - **Name:** `AllowAllAzureIps`
   - **Start IP:** `0.0.0.0`
   - **End IP:** `0.0.0.0`

**Si no existe, créala:**
```bash
az mysql flexible-server firewall-rule create \
  --resource-group <tu-grupo-recursos> \
  --server-name mysql-biblioteca-utm \
  --name AllowAllAzureIps \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

---

### 4️⃣ Verificar Credenciales

**Prueba localmente que las credenciales son correctas:**

```bash
cd /home/josemontalban/Desarrollo/api_bibliotecainteligente

# Crea un archivo temporal de prueba
cat > test-credentials.js << 'EOF'
const mysql = require('mysql2/promise');

const config = {
  host: 'mysql-biblioteca-utm.mysql.database.azure.com',
  user: 'biblioteca_user',
  password: 'biblioteca_pass_123',
  database: 'biblioteca_inteligente',
  port: 3306,
  ssl: { rejectUnauthorized: false }
};

console.log('Probando conexión...');
mysql.createPool(config).getConnection()
  .then(conn => {
    console.log('✅ CONEXIÓN EXITOSA');
    conn.release();
  })
  .catch(err => {
    console.error('❌ ERROR:', err.message);
  })
  .finally(() => process.exit(0));
EOF

node test-credentials.js
rm test-credentials.js
```

**Si da error:**
- `ER_ACCESS_DENIED_ERROR` → Credenciales incorrectas
- `ENOTFOUND` → Host incorrecto o no existe
- `ECONNREFUSED` → Firewall bloqueando

---

### 5️⃣ Verificar Logs en Azure

```bash
# Ver logs en tiempo real
az webapp log tail --resource-group biblioteca-rg --name bibliotecainteligente

# O accede al contenedor SSH
# En Azure Portal → App Service → SSH
```

**Busca mensajes como:**
```
❌ Conexión a MySQL: FALLIDA
   Código: ER_ACCESS_DENIED_ERROR
   Problema: Credenciales incorrectas
```

---

## 🔧 Soluciones Comunes

### Problema: "ER_ACCESS_DENIED_ERROR"

**Causa:** Contraseña incorrecta

**Solución:**
1. Verifica tu contraseña en Azure Portal → MySQL → Overview
2. Si olvidaste, reinicia:
```bash
az mysql flexible-server identity-server-reset-password \
  --resource-group <tu-grupo-recursos> \
  --server-name mysql-biblioteca-utm
```
3. Actualiza en Azure Portal:
```bash
az webapp config appsettings set \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente \
  --settings DB_PASSWORD=tu_nueva_contraseña
```

---

### Problema: "ENOTFOUND" (Host no encontrado)

**Causa:** Host incorrecto o typo

**Solución:**
1. Verifica el nombre exacto del servidor MySQL en Azure Portal
2. Debe ser: `mysql-biblioteca-utm.mysql.database.azure.com`
3. Actualiza:
```bash
az webapp config appsettings set \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente \
  --settings DB_HOST=mysql-biblioteca-utm.mysql.database.azure.com
```

---

### Problema: "ECONNREFUSED" (Conexión rechazada)

**Causa:** Firewall de MySQL bloqueando

**Solución:**
1. Ve a MySQL → Networking
2. Agrega o modifica la regla `AllowAllAzureIps`
3. Verifica que Start IP y End IP sean: `0.0.0.0` - `0.0.0.0`
4. Reinicia la app:
```bash
az webapp restart --resource-group biblioteca-rg --name bibliotecainteligente
```

---

### Problema: "ER_BAD_DB_ERROR" (Base de datos no existe)

**Causa:** Base de datos no fue creada

**Solución:**
1. Conecta a MySQL con herramienta como MySQL Workbench
2. Ejecuta:
```sql
CREATE DATABASE IF NOT EXISTS biblioteca_inteligente;
USE biblioteca_inteligente;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correoElectronico VARCHAR(100) UNIQUE NOT NULL,
  numeroCelular VARCHAR(20) NOT NULL,
  fechaNacimiento DATE NOT NULL,
  contrasena VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Pasos para Arreglar (Resumen)

### Opción 1: Verificación Completa

```bash
# 1. Ver variables
az webapp config appsettings list --resource-group biblioteca-rg --name bibliotecainteligente

# 2. Probar credenciales localmente
cd /home/josemontalban/Desarrollo/api_bibliotecainteligente
# Crea test-db.js con las credenciales exactas de Azure

# 3. Verificar MySQL está activo
az mysql flexible-server show --resource-group biblioteca-rg --name mysql-biblioteca-utm

# 4. Verificar firewall
az mysql flexible-server firewall-rule list --resource-group biblioteca-rg --server-name mysql-biblioteca-utm

# 5. Reiniciar app
az webapp restart --resource-group biblioteca-rg --name bibliotecainteligente

# 6. Ver logs
az webapp log tail --resource-group biblioteca-rg --name bibliotecainteligente
```

### Opción 2: Reset Completo

```bash
# 1. Actualizar todas las variables de entorno
az webapp config appsettings set \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    DB_HOST=mysql-biblioteca-utm.mysql.database.azure.com \
    DB_PORT=3306 \
    DB_USER=biblioteca_user \
    DB_PASSWORD=biblioteca_pass_123 \
    DB_NAME=biblioteca_inteligente

# 2. Reiniciar
az webapp restart --resource-group biblioteca-rg --name bibliotecainteligente

# 3. Ver logs
az webapp log tail --resource-group biblioteca-rg --name bibliotecainteligente

# 4. Probar
curl https://bibliotecainteligente.azurewebsites.net/api/health
```

---

## 📊 Información de Conexión Esperada

**Cuando todo funciona, verás en los logs:**

```
📊 Configuración de Base de Datos:
  Host: mysql-biblioteca-utm.mysql.database.azure.com
  Puerto: 3306
  Usuario: biblioteca_user
  Base de datos: biblioteca_inteligente
  SSL: Habilitado (sin validar certificado - Azure)
✅ Conexión a MySQL: EXITOSA
```

**Si hay error:**

```
❌ Conexión a MySQL: FALLIDA
   Código: ER_ACCESS_DENIED_ERROR
   Mensaje: Access denied for user 'biblioteca_user'@...
   Problema: Credenciales incorrectas (usuario/contraseña)
```

---

## 🆘 Si Aún No Funciona

### Contacta con soporte y proporciona:

1. **Salida de variables:**
```bash
az webapp config appsettings list \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente
```

2. **Último error en logs:**
```bash
az webapp log tail --resource-group biblioteca-rg --name bibliotecainteligente --tail 50
```

3. **Estado del servidor MySQL:**
```bash
az mysql flexible-server show \
  --resource-group biblioteca-rg \
  --name mysql-biblioteca-utm
```

4. **Resultado de test local:**
Ejecuta el script de test-credentials.js como se describe arriba

---

## 📝 Nota Importante

El código ha sido mejorado para mostrar **errores más detallados**. Ahora verás:

- **Código de error** (ER_ACCESS_DENIED_ERROR, ENOTFOUND, etc.)
- **Descripción clara** del problema
- **Sugerencia** de cómo solucionarlo

Revisa los logs después de desplegar para ver el error específico.

---

**Archivo actualizado:** `src/infrastructure/infrastructure.Database.js`
**Archivo mejorado:** `boot.server.js` (mejor manejo de errores)
