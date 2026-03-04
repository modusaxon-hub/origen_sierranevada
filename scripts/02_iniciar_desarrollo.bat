@echo off
REM ========================================
REM  02 - INICIAR SERVIDOR DE DESARROLLO
REM ========================================
REM Ejecutar cada vez que quieras desarrollar
REM Abre el servidor Vite en puerto 5000

echo.
echo =========================================
echo   ORIGEN SIERRA NEVADA - Dev Server
echo =========================================
echo.
echo   Puerto: http://127.0.0.1:5000
echo   Directorio: %cd%
echo.
echo   Iniciando npm run dev...
echo   (Presiona Ctrl+C para detener)
echo.

cd /d "D:\Documentos\Proyectos ADSO\origen_sierranevada\web-page\pages"

npm run dev

pause
