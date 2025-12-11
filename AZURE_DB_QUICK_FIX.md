# 🔧 Checklist Rápido - Conexión BD en Azure

## ⚡ 5 Pasos Rápidos

### 1. Verificar Variables de Entorno
```bash
az webapp config appsettings list \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente | grep DB_
```

**Deberías ver:**
```
DB_HOST = mysql-biblioteca-utm.mysql.database.azure.com
DB_PORT = 3306
DB_USER = biblioteca_user
DB_PASSWORD = biblioteca_pass_123
DB_NAME = biblioteca_inteligente
```

### 2. Verificar MySQL Activo
```bash
az mysql flexible-server show \
  --resource-group biblioteca-rg \
  --name mysql-biblioteca-utm \
  --query state -o tsv
```

**Resultado esperado:** `Ready`

Si dice `Stopped`, inicia:
```bash
az mysql flexible-server start \
  --resource-group biblioteca-rg \
  --name mysql-biblioteca-utm
```

### 3. Verificar Firewall
```bash
az mysql flexible-server firewall-rule list \
  --resource-group biblioteca-rg \
  --server-name mysql-biblioteca-utm
```

**Debe existir una regla con:**
- Name: `AllowAllAzureIps`
- StartIpAddress: `0.0.0.0`
- EndIpAddress: `0.0.0.0`

Si no existe:
```bash
az mysql flexible-server firewall-rule create \
  --resource-group biblioteca-rg \
  --server-name mysql-biblioteca-utm \
  --name AllowAllAzureIps \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### 4. Reiniciar Aplicación
```bash
az webapp restart \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente
```

### 5. Ver Logs
```bash
az webapp log tail \
  --resource-group biblioteca-rg \
  --name bibliotecainteligente
```

**Busca:**
```
✅ Conexión a MySQL: EXITOSA
```

---

## 🎯 Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `ER_ACCESS_DENIED_ERROR` | Contraseña incorrecta | Verifica DB_PASSWORD en Portal |
| `ENOTFOUND` | Host incorrecto | Verifica DB_HOST (debe terminar en .azure.com) |
| `ECONNREFUSED` | Firewall bloqueando | Agrega regla AllowAllAzureIps |
| `ER_BAD_DB_ERROR` | BD no existe | Crea la BD con init.sql |
| `PROTOCOL_CONNECTION_LOST` | Timeout | Aumenta connectionLimit o revisa BD activa |

---

## 🚀 Una Sola Línea para Arreglar TODO

```bash
# 1. Configura variables
az webapp config appsettings set --resource-group biblioteca-rg --name bibliotecainteligente --settings NODE_ENV=production PORT=8080 DB_HOST=mysql-biblioteca-utm.mysql.database.azure.com DB_PORT=3306 DB_USER=biblioteca_user DB_PASSWORD=biblioteca_pass_123 DB_NAME=biblioteca_inteligente

# 2. Reinicia
az webapp restart --resource-group biblioteca-rg --name bibliotecainteligente

# 3. Espera 30 segundos y prueba
curl https://bibliotecainteligente.azurewebsites.net/api/health
```

---

## 📊 Debug: Ver Error Exacto

```bash
# Ver últimas 20 líneas de logs
az webapp log tail --resource-group biblioteca-rg --name bibliotecainteligente --tail 20

# O accede a SSH en Azure Portal:
# App Service → SSH
# Luego: tail -f /home/LogFiles/application_log_*.txt
```

---

## ✅ Cuando todo funciona...

Verás en logs:
```
📊 Configuración de Base de Datos:
  Host: mysql-biblioteca-utm.mysql.database.azure.com
  Puerto: 3306
  Usuario: biblioteca_user
  Base de datos: biblioteca_inteligente
  SSL: Habilitado
✅ Conexión a MySQL: EXITOSA
✓ Controlador cargado correctamente
✓ Servidor corriendo en puerto 8080
```

Y al probar:
```bash
$ curl https://bibliotecainteligente.azurewebsites.net/api/health
{"status":"API funcionando correctamente","timestamp":"2025-12-11T..."}
```

---

**Para diagnóstico completo, lee: DATABASE_TROUBLESHOOTING.md**
