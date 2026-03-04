@echo off
REM ========================================
REM  06 - LIMPIAR PROYECTO
REM ========================================
REM Opcional: elimina node_modules y build
REM Útil si necesitas espacio en disco

setlocal enabledelayedexpansion

echo.
echo =========================================
echo   ORIGEN SIERRA NEVADA
echo   06 - Limpiar Proyecto
echo =========================================
echo.
echo   ⚠️  ADVERTENCIA:
echo   Esto eliminará:
echo   - node_modules/ (reinstalables con 01_instalar_dependencias.bat)
echo   - build/ (regenerables con 03 y 04)
echo.

REM Pedir confirmación
set /p CONFIRM="¿Estás seguro de que deseas limpiar? (S/N): "

if /i "%CONFIRM%" neq "S" (
    echo.
    echo   Operación cancelada.
    echo.
    pause
    exit /b
)

cd /d "D:\Documentos\Proyectos ADSO\origen_sierranevada\web-page\pages"

echo.
echo   Eliminando carpetas...

if exist "node_modules" (
    echo   - Eliminando node_modules/
    rmdir /S /Q node_modules
)

if exist "build" (
    echo   - Eliminando build/
    rmdir /S /Q build
)

echo.
echo =========================================
echo   ✓ Limpieza completada
echo =========================================
echo.
echo   Si necesitas desarrollar de nuevo:
echo   - Ejecutar 01_instalar_dependencias.bat
echo   - Luego 02_iniciar_desarrollo.bat
echo.

pause
