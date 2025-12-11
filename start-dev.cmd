@echo off
REM Local development server with hot reload and debugging
REM Simulates Azure environment as closely as possible

setlocal enabledelayedexpansion

echo.
echo ===================================
echo Desarrollo Local - Biblioteca API
echo ===================================
echo.

REM Check if node_modules exists
if not exist node_modules (
  echo Instalando dependencias...
  call npm install
  if !ERRORLEVEL! neq 0 (
    echo Error durante la instalacion de dependencias
    exit /b 1
  )
)

REM Load environment variables from .env if exists
if exist .env (
  echo Cargando variables de .env...
  for /f "delims==" %%A in ('findstr /v "^#" .env') do (
    set %%A
  )
)

REM Set default values if not in .env
if not defined NODE_ENV set NODE_ENV=development
if not defined PORT set PORT=3000

echo.
echo Iniciando servidor en modo desarrollo...
echo NODE_ENV: %NODE_ENV%
echo PORT: %PORT%
echo.
echo Endpoints disponibles:
echo   http://localhost:%PORT%/api/health
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

REM Start development server with nodemon
call npm run dev

exit /b %ERRORLEVEL%
