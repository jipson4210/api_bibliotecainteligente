@echo off
REM Check prerequisites for Windows deployment
REM This script verifies all required components are installed

echo.
echo ===================================
echo Verificando Prerequisites para Deploy
echo ===================================
echo.

REM Check Node.js
echo Verificando Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo [ERROR] Node.js no esta instalado
  echo Descargar desde: https://nodejs.org/
  exit /b 1
) else (
  for /f "tokens=*" %%i in ('node --version') do echo [OK] Node.js %%i
)

REM Check npm
echo Verificando npm...
npm --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo [ERROR] npm no esta instalado
  exit /b 1
) else (
  for /f "tokens=*" %%i in ('npm --version') do echo [OK] npm %%i
)

REM Check IIS (if running on Windows with IIS)
echo.
echo Verificando componentes opcionales...
echo.

REM Check if git is available
git --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
  for /f "tokens=*" %%i in ('git --version') do echo [OK] %%i
) else (
  echo [INFO] Git no esta instalado (opcional)
)

REM Summary
echo.
echo ===================================
echo Setup completado exitosamente
echo ===================================
echo.
echo Proximos pasos:
echo 1. Configurar variables de entorno en .env
echo 2. Ejecutar: npm install --production
echo 3. Ejecutar: npm start
echo.
echo O ejecutar deploy.cmd directamente para deployment en Azure
echo.

exit /b 0
