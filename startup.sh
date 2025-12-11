#!/bin/bash
set -e

echo "=== Iniciando API Biblioteca Inteligente ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# Instalar dependencias
echo "Instalando dependencias..."
npm install --production

# Iniciar servidor
echo "Iniciando servidor..."
npm start
