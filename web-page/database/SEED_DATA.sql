-- ========================================================
-- DATOS INICIALES — Admin + Usuarios de Prueba
-- ========================================================

-- IMPORTANTE: Ejecutar DESPUÉS de INIT_DATABASE.sql y NUCLEAR_FIX.sql
-- Los UUIDs deben corresponder a usuarios creados en auth.users de Supabase

-- ========================================================
-- PASO 1: Insertar Perfil de Administrador (Usuario Manual)
-- ========================================================
-- NOTA: Debes crear el usuario en Supabase Auth primero (signup o crear manualmente)
-- Luego reemplaza 'YOUR_ADMIN_UUID' con el UUID real del usuario

-- Opción A: Si ya creaste un usuario en Auth, usa su UUID:
INSERT INTO public.profiles (
    id, email, full_name, role_name, status, phone, address
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'admin@origensierranevadasm@gmail.com',
    'Administrador Origen',
    'Administrador',
    'active',
    '+573107405154',
    'Sierra Nevada, Santa Marta'
) ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- PASO 2: Insertar Usuarios de Prueba (Colaboradores)
-- ========================================================
INSERT INTO public.profiles (
    id, email, full_name, role_name, status, phone, address
) VALUES
(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'colaborador@origensierranevadasm@gmail.com',
    'Colaborador Test',
    'Colaborador',
    'active',
    '+573107405155',
    'Santa Marta'
),
(
    '00000000-0000-0000-0000-000000000003'::uuid,
    'usuario@origensierranevadasm@gmail.com',
    'Usuario Cliente',
    'Usuario',
    'active',
    '+573107405156',
    'Cartagena'
)
ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- PASO 3: Insertar Productos Iniciales (ya están en INIT_DATABASE.sql)
-- Verificar que Café Malú y Sombra Sagrada existan
-- ========================================================

-- ========================================================
-- VERIFICACIÓN
-- ========================================================
SELECT
    'Datos iniciales insertados ✅' AS status,
    (SELECT COUNT(*) FROM public.profiles) AS total_profiles,
    (SELECT COUNT(*) FROM public.products) AS total_products;

-- ========================================================
-- ⚠️ IMPORTANTE PARA PRODUCCIÓN
-- ========================================================
-- Los UUIDs hardcodeados (00000000-0000-0000-0000-000000000001) son
-- SOLO para desarrollo. En producción:
--
-- 1. Crear usuarios reales en Supabase Auth
-- 2. Obtener sus UUIDs
-- 3. Hacer INSERT con esos UUIDs reales
--
-- Para obtener el UUID de un usuario en Supabase:
-- - Dashboard > Authentication > Users > Copiar el UUID de cada usuario
-- ========================================================
