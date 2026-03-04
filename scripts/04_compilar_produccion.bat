@echo off
REM ========================================
REM  04 - COMPILAR PRODUCCIÓN
REM ========================================
REM Ejecutar DESPUÉS de validar sin errores
REM Genera la carpeta /build optimizada

echo.
echo =========================================
echo   ORIGEN SIERRA NEVADA
echo   04 - Compilar para Producción
echo =========================================
echo.
echo   Compilando para producción...
echo   Esto optimiza y minifica el código...
echo.

cd /d "D:\Documentos\Proyectos ADSO\origen_sierranevada\web-page\pages"

npm run build

echo.
echo =========================================
echo   ✓ Compilación completada
echo =========================================
echo.
echo   Carpeta generada: build/
echo.
echo   Próximo paso: Ejecutar 05_copiar_a_htdocs.bat
echo   (Para subir cambios a InfinityFree staging)
echo.

pause
