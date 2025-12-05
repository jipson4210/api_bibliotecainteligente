#!/bin/bash

# Script para facilitar Docker en WSL
set -e

echo "🐳 Biblioteca Inteligente - Docker Setup para WSL"
echo "=================================================="
echo ""

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo."
    echo "📋 En WSL, necesitas:"
    echo "   1. Abrir Docker Desktop en Windows"
    echo "   2. Ir a Settings > Resources > WSL Integration"
    echo "   3. Habilitar tu distribución WSL"
    exit 1
fi

echo "✅ Docker está corriendo"
echo ""

# Menú de opciones
echo "Selecciona una opción:"
echo "1) Levantar servicios (up)"
echo "2) Detener servicios (down)"
echo "3) Ver logs"
echo "4) Verificar estado"
echo "5) Acceder a MySQL"
echo "6) Limpiar todo (down -v)"
echo ""
read -p "Opción (1-6): " option

case $option in
    1)
        echo ""
        echo "🚀 Levantando servicios..."
        docker-compose up -d
        echo ""
        echo "✅ Servicios levantados!"
        echo ""
        echo "📊 Estado:"
        docker-compose ps
        echo ""
        echo "🌐 API disponible en: http://localhost:3000"
        echo "🗄️  MySQL disponible en: localhost:3306"
        ;;
    2)
        echo ""
        echo "🛑 Deteniendo servicios..."
        docker-compose down
        echo "✅ Servicios detenidos"
        ;;
    3)
        echo ""
        echo "📋 Selecciona logs:"
        echo "1) Todos"
        echo "2) API"
        echo "3) MySQL"
        read -p "Opción (1-3): " logs_option
        case $logs_option in
            1) docker-compose logs -f ;;
            2) docker-compose logs -f api ;;
            3) docker-compose logs -f mysql ;;
            *) echo "Opción inválida" ;;
        esac
        ;;
    4)
        echo ""
        echo "📊 Estado de servicios:"
        docker-compose ps
        echo ""
        echo "🗄️  Información de Docker:"
        docker info | head -20
        ;;
    5)
        echo ""
        echo "🔐 Conectando a MySQL..."
        echo "Credenciales:"
        echo "  Usuario: biblioteca_user"
        echo "  Contraseña: biblioteca_pass_123"
        echo "  BD: biblioteca_inteligente"
        echo ""
        docker exec -it biblioteca-mysql mysql -u biblioteca_user -p biblioteca_inteligente
        ;;
    6)
        echo ""
        echo "🗑️  Limpiando todo (incluyendo datos)..."
        docker-compose down -v
        echo "✅ Limpieza completada"
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac
