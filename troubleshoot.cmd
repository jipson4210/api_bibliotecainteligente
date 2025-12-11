@echo off
REM Troubleshooting script for Windows deployment issues

setlocal enabledelayedexpansion

echo.
echo ===================================
echo Troubleshooting - Biblioteca API
echo ===================================
echo.

REM Check Node.js version
echo [1] Verificando Node.js...
node --version
npm --version
echo.

REM Check if node_modules exists
echo [2] Verificando dependencias...
if exist node_modules (
  echo [OK] node_modules existe
  echo Numero de paquetes instalados:
  dir /s node_modules | find /c "\" 
) else (
  echo [ERROR] node_modules no existe
  echo Ejecuta: npm install --production
)
echo.

REM Check web.config
echo [3] Verificando configuracion IIS...
if exist web.config (
  echo [OK] web.config existe
) else (
  echo [ERROR] web.config no existe - necesario para IIS
)
echo.

REM Check .env
echo [4] Verificando variables de entorno...
if exist .env (
  echo [OK] Archivo .env existe
  echo Variables configuradas:
  for /f "tokens=1 delims==" %%A in ('findstr /v "^#" .env') do echo   - %%A
) else (
  echo [WARNING] Archivo .env no existe
  echo Copia .env.example a .env y configura los valores
)
echo.

REM Try to start server on test port
echo [5] Probando inicio del servidor...
set TEST_PORT=9999
echo Intentando iniciar servidor en puerto %TEST_PORT%...
timeout /t 2 /nobreak >nul
start "" cmd /c "PORT=%TEST_PORT% timeout /t 3 npm start >nul 2>&1"
timeout /t 4 /nobreak >nul

netstat -ano | findstr :%TEST_PORT% >nul
if %ERRORLEVEL% equ 0 (
  echo [OK] Servidor inicio correctamente
  REM Kill the test server
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr :%TEST_PORT%') do taskkill /PID %%A /F >nul 2>&1
) else (
  echo [ERROR] Servidor no inicio correctamente
  echo Verifica los logs: npm start
)
echo.

REM Check firewall
echo [6] Verificando puertos...
echo Puertos en uso:
netstat -ano | findstr LISTENING | findstr /E ":3000 :3001 :8080 :8081"
echo.

REM Summary
echo ===================================
echo Diagnostico completado
echo ===================================
echo.
echo Pasos para resolver problemas:
echo 1. Si falta node_modules: ejecuta 'npm install --production'
echo 2. Si falta web.config: el archivo debe estar en la raiz
echo 3. Si falta .env: copia .env.example a .env y configura BD
echo 4. Si el puerto esta ocupado: cambia el valor de PORT en .env
echo 5. Para logs detallados: 'npm start' mostrara errores
echo.

exit /b 0
