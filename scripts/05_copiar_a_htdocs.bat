@echo off
REM ========================================
REM  05 - COPIAR A HTDOCS (STAGING)
REM ========================================
REM Ejecutar DESPUÉS de validar y compilar
REM Copia build/ a htdocs/ para InfinityFree

setlocal enabledelayedexpansion

echo.
echo =========================================
echo   ORIGEN SIERRA NEVADA
echo   05 - Copiar a htdocs (Staging)
echo =========================================
echo.
echo   ⚠️  IMPORTANTE:
echo   - Solo ejecutar DESPUÉS de validar sin errores
echo   - Los cambios estarán visibles en:
echo     https://origen2025.share.zrok.io/
echo.

REM Pedir confirmación
set /p CONFIRM="¿Estás seguro de que deseas copiar a htdocs? (S/N): "

if /i "%CONFIRM%" neq "S" (
    echo.
    echo   Operación cancelada.
    echo.
    pause
    exit /b
)

cd /d "D:\Documentos\Proyectos ADSO\origen_sierranevada"

REM Limpiar htdocs (excepto archivos de configuración críticos)
echo.
echo   Limpiando htdocs anterior...
if exist "htdocs\*" (
    del /S /Q htdocs\* >nul 2>&1
    for /d %%i in (htdocs\*) do rmdir /S /Q "%%i" >nul 2>&1
)

REM Copiar build a htdocs
echo   Copiando archivos de build a htdocs...
xcopy /E /I /Y "web-page\pages\build\*" "htdocs\" >nul 2>&1

echo.
echo =========================================
echo   ✓ Copia completada
echo =========================================
echo.
echo   Cambios enviados a staging:
echo   https://origen2025.share.zrok.io/
echo.
echo   Verifica en el navegador que todo se ve correcto.
echo.

pause
