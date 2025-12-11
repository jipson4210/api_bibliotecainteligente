@echo off
setlocal enabledelayedexpansion

REM Deployment batch file for Azure App Service (Windows/IIS with iisnode)
REM This script is called by Azure during deployment (.deployment file references this)

echo.
echo ===================================
echo Biblioteca Inteligente API Deployment
echo ===================================
echo.

REM Get npm path from Node.js installation
for /f "delims=" %%A in ('where npm') do set NPM_PATH=%%A
echo NPM Path: %NPM_PATH%

REM Navigate to site\wwwroot (deployment folder)
cd /d "%DEPLOYMENT_TARGET%"

echo.
echo Installing production dependencies...
echo.

REM Clean node_modules if exists (optional - can speed up deployment)
if exist node_modules (
  echo Removing existing node_modules...
  rmdir /s /q node_modules 2>nul
)

REM Install production dependencies only
if not exist node_modules (
  call npm install --production --no-optional
  if !ERRORLEVEL! neq 0 (
    echo.
    echo ERROR: npm install failed with code !ERRORLEVEL!
    exit /b !ERRORLEVEL!
  )
)

echo.
echo ===================================
echo Deployment completed successfully!
echo ===================================
echo.
echo NOTE: Application will start automatically via iisnode
echo.

exit /b 0
