@echo off
REM ========================================
REM  03 - VALIDAR PROYECTO
REM ========================================
REM Ejecutar ANTES de compilar para producción
REM Verifica errores TypeScript y genera build de prueba

echo.
echo =========================================
echo   ORIGEN SIERRA NEVADA
echo   03 - Validar Proyecto (Build Test)
echo =========================================
echo.
echo   Verificando errores TypeScript...
echo   Generando build de prueba...
echo.

cd /d "D:\Documentos\Proyectos ADSO\origen_sierranevada\web-page\pages"

npm run build

echo.
echo =========================================
echo   ✓ Build completado
echo =========================================
echo.
echo   Si no hay errores rojos arriba:
echo   - Próximo paso: Ejecutar 04_compilar_produccion.bat
echo.
echo   Si hay errores:
echo   - Revisar mensajes arriba
echo   - Corregir en el código
echo   - Ejecutar 03_validar_proyecto.bat nuevamente
echo.

pause
