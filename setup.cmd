@echo off
REM Initial setup script for Windows development environment

setlocal enabledelayedexpansion

echo.
echo ===================================
echo Setup Inicial - Biblioteca API
echo ===================================
echo.

REM Check prerequisites
call check-prerequisites.cmd
if !ERRORLEVEL! neq 0 (
  echo Setup fallido
  exit /b 1
)

REM Install dependencies
echo.
echo Instalando dependencias...
call npm install
if !ERRORLEVEL! neq 0 (
  echo Error durante npm install
  exit /b 1
)

REM Create .env if not exists
if not exist .env (
  echo.
  echo Creando archivo .env...
  echo # Configuracion de Biblioteca Inteligente > .env
  echo NODE_ENV=development >> .env
  echo PORT=3000 >> .env
  echo # >> .env
  echo # Configuracion MySQL local ^(descomentar para desarrollo local^) >> .env
  echo # DB_HOST=localhost >> .env
  echo # DB_PORT=3306 >> .env
  echo # DB_USER=biblioteca_user >> .env
  echo # DB_PASSWORD=biblioteca_pass_123 >> .env
  echo # DB_NAME=biblioteca_inteligente >> .env
  echo # >> .env
  echo # Configuracion MySQL Azure >> .env
  echo # DB_HOST=mysql-biblioteca-utm.mysql.database.azure.com >> .env
  echo # DB_PORT=3306 >> .env
  echo # DB_USER=biblioteca_user@mysql-biblioteca-utm >> .env
  echo # DB_PASSWORD={your_password} >> .env
  echo # DB_NAME=biblioteca_inteligente >> .env
  echo.
  echo [OK] Archivo .env creado
  echo [TODO] Edita .env con tus credenciales de base de datos
) else (
  echo [INFO] Archivo .env ya existe
)

echo.
echo ===================================
echo Setup completado
echo ===================================
echo.
echo Para iniciar el servidor:
echo   start-dev.cmd   (con hot reload)
echo   npm start       (produccion)
echo.

exit /b 0
