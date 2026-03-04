-- ========================================================
-- REPARACIÓN DE ESQUEMA Y RLS — MODUS AXON
-- PROYECTO: Origen Sierra Nevada (04 Mar 2026)
-- ========================================================

-- 1. CORRECCIÓN DE COLUMNA EN ORDERS
-- La query del frontend busca 'total_amount', pero la tabla tiene 'total'.
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='total') THEN
        ALTER TABLE public.orders RENAME COLUMN total TO total_amount;
    END IF;
END $$;

-- 2. SINCRONIZACIÓN DE ROLES EN PROFILES
-- Asegurar que role_name tenga los valores correctos de la tabla user_roles.
-- Si la columna 'role' (deprecated) tiene datos, los migramos.
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        -- Migrar admin -> Administrador
        UPDATE public.profiles SET role_name = 'Administrador' WHERE role = 'admin' AND (role_name IS NULL OR role_name = 'Usuario');
        -- Migrar user -> Usuario (si no está ya seteado)
        UPDATE public.profiles SET role_name = 'Usuario' WHERE role = 'user' AND role_name IS NULL;
        
        -- Opcional: Renombrar columna vieja para evitar confusión
        ALTER TABLE public.profiles RENAME COLUMN role TO role_deprecated;
    END IF;
END $$;

-- 3. ACTUALIZACIÓN DE POLÍTICAS RLS PARA USAR role_name
-- Las políticas anteriores fallan si buscan la columna 'role' que ya no es la principal.

-- RLS: Orders
DROP POLICY IF EXISTS "Orders Owner/Admin" ON public.orders;

CREATE POLICY "Orders Owner/Admin" ON public.orders FOR ALL USING (
    auth.uid () = user_id
    OR EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE
            id = auth.uid ()
            AND role_name = 'Administrador'
    )
);

-- RLS: Profiles (Selección)
DROP POLICY IF EXISTS "Admins pueden ver todos los perfiles" ON public.profiles;

DROP POLICY IF EXISTS "Admins can see all profiles" ON public.profiles;

CREATE POLICY "Admins pueden ver todos los perfiles" ON public.profiles FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE
                id = auth.uid ()
                AND role_name = 'Administrador'
        )
    );

-- RLS: Audit Logs
DROP POLICY IF EXISTS "Admins Audit" ON public.audit_logs;

CREATE POLICY "Admins Audit" ON public.audit_logs FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE
                id = auth.uid ()
                AND role_name = 'Administrador'
        )
    );

-- 4. CSP REINFORCEMENT (Opcional, en el index_html o header)
-- Nota: Los errores de CSP en la consola son por fuentes externas.
-- Se recomienda agregar las URLs de Google Fonts y Cloudflare a la directiva font-src.