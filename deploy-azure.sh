#!/bin/bash

# Script para desplegar en Azure App Service (Linux)
# Uso: ./deploy-azure.sh

set -e

echo "🚀 Iniciando despliegue a Azure App Service (Linux)"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar que estamos en el directorio correcto
if [ ! -f "boot.server.js" ]; then
  echo "❌ Error: boot.server.js no encontrado. Ejecuta este script desde la raíz del proyecto."
  exit 1
fi

echo -e "${BLUE}📋 Información del Proyecto:${NC}"
echo "  - Punto de entrada: boot.server.js"
echo "  - Estructura DDD en: src/"
echo "  - Plataforma: Linux (Azure App Service)"

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
  echo "❌ npm no está instalado"
  exit 1
fi

echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm ci --only=production

echo -e "${BLUE}✅ Verificando estructura del proyecto...${NC}"
test -d "src/domain" && echo "  ✓ Capa Domain encontrada"
test -d "src/application" && echo "  ✓ Capa Application encontrada"
test -d "src/infrastructure" && echo "  ✓ Capa Infrastructure encontrada"
test -d "src/presentation" && echo "  ✓ Capa Presentation encontrada"

echo -e "${BLUE}📋 Configuración requerida en Azure:${NC}"
echo "  NODE_ENV=production"
echo "  PORT=8080"
echo "  DB_HOST=<tu-servidor-mysql>"
echo "  DB_USER=<tu-usuario>"
echo "  DB_PASSWORD=<tu-contraseña>"
echo "  DB_NAME=biblioteca_inteligente"
echo "  DB_PORT=3306"

echo -e "${GREEN}✨ Proyecto listo para desplegar${NC}"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo "1. Commit y push de cambios:"
echo "   git add ."
echo "   git commit -m 'chore: prepare for Azure Linux deployment'"
echo "   git push origin main"
echo ""
echo "2. O desplega manualmente con:"
echo "   az webapp deployment source config-zip --resource-group <grupo> --name bibliotecainteligente --src app.zip"
echo ""
