@echo off
REM ========================================
REM  01 - INSTALAR DEPENDENCIAS
REM ========================================
REM Ejecutar UNA SOLA VEZ al clonar el proyecto
REM Instala node_modules necesarios

echo.
echo =========================================
echo   ORIGEN SIERRA NEVADA
echo   01 - Instalar Dependencias
echo =========================================
echo.
echo   Instalando dependencias del proyecto...
echo   Esto puede tardar 2-5 minutos...
echo.

cd /d "D:\Documentos\Proyectos ADSO\origen_sierranevada\web-page\pages"

npm install

echo.
echo =========================================
echo   ✓ Dependencias instaladas
echo =========================================
echo.
echo   Próximo paso: Ejecutar 02_iniciar_desarrollo.bat
echo.

pause
