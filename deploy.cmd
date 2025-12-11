@echo off
setlocal enabledelayedexpansion

echo Cleaning up old node_modules...
if exist node_modules (
  echo Removing node_modules folder...
  rmdir /s /q node_modules
)

echo Installing production dependencies...
call npm install --production

echo Starting application...
call npm start

:EOF
