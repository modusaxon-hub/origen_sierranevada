@echo off
TITLE Origen Sierra Nevada - Tunnel (ZROK)
color 0a
CLS

ECHO ========================================================
ECHO   INICIANDO TUNEL ZROK - ORIGEN SIERRA NEVADA
ECHO ========================================================
ECHO.
ECHO Recuerda: 
ECHO 1. Si ves un error "SERVER_TOO_MANY_REQUESTS", espera 30 segundos y reintenta.
ECHO 2. No cierres esta ventana mientras uses la tienda.
ECHO.

cd /d "d:\Diseno WEB\origen_sierranevada\web-page\pages"

:: Comando original
C:\zrok_1.1.10\zrok.exe share reserved origen2025

ECHO.
ECHO El tunel se ha cerrado.
PAUSE
