# 🛡️ Guía de Mantenimiento y Limpieza - Origen Sierra Nevada

Este documento detalla los procedimientos estándar para el mantenimiento del ecosistema digital, asegurando la integridad de los datos y el rendimiento óptimo de la plataforma.

---

## 1. 📂 Limpieza de Código y Estructura
Para mantener un repositorio limpio y profesional, se deben seguir estas reglas:

*   **Carpeta `temp/`**: Esta carpeta contiene archivos de respaldo temporales o pruebas individuales. **No debe subirse a producción**. Antes de un despliegue mayor, vacíe esta carpeta si los cambios ya han sido integrados en `src/`.
*   **Archivos Huérfanos**: Elimine scripts de prueba como `check-auth.js` o `create_admin.js` una vez que su funcionalidad haya sido verificada o integrada en servicios oficiales.
*   **Build Artifacts**: Asegúrese de que la carpeta `dist/` o `build/` esté en el `.gitignore`.

---

## 2. 🗄️ Modelo de Limpieza de Datos
Periódicamente (mensual o trimestralmente), realice las siguientes acciones en el dashboard de Supabase (SQL Editor):

### A. Identificación de Datos de Prueba
Use esta consulta para encontrar pedidos o usuarios de prueba:
```sql
-- Buscar usuarios con correos de prueba
SELECT id, email, full_name 
FROM profiles 
WHERE email LIKE '%test%' OR email LIKE '%example%';

-- Buscar pedidos antiguos que nunca se pagaron (más de 30 días)
SELECT id, created_at, status 
FROM orders 
WHERE status = 'pending' 
AND created_at < NOW() - INTERVAL '30 days';
```

### B. Limpieza de Almacenamiento (Storage)
1. Revise el bucket de `product-images`.
2. Elimine manualmente imágenes que no tengan una relación activa en la tabla `products`.
3. *Futuro*: Implementar un trigger de base de datos para eliminar el archivo físico al borrar un producto.

---

## 3. 💾 Estrategia de Backups

### A. Backup Automático (Supabase)
Supabase realiza backups diarios de la base de datos automáticamente (Plan Pro). En el plan Gratuito, se recomienda el método manual.

### B. Backup Manual (SQL Dump)
Para realizar un respaldo completo de la estructura y datos desde su terminal local:

1. Instale Supabase CLI.
2. Ejecute:
   ```bash
   supabase db dump --project-ref [SU_PROJECT_ID] -f backup_fecha.sql
   ```

### C. Backup de Contenido (CSV)
Para propósitos administrativos o contables, exporte las tablas críticas:
- `orders` -> `Formato CSV`
- `profiles` -> `Formato CSV`

---

## 4. 🚀 Checklist de Mantenimiento Preventivo
- [ ] Verificar logs de errores en Supabase.
- [ ] Revisar límites de uso (Storage y API Requests).
- [ ] Validar que todas las imágenes en el Hero Carousel tengan dimensiones optimizadas (< 500kb).
- [ ] Actualizar dependencias críticas de seguridad (`npm audit`).

---
*Última actualización: Marzo 2026*
