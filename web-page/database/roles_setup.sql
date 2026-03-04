-- ========================================================
-- SISTEMA DE ROLES ESCALABLE — MODUS AXON
-- PROYECTO: Origen Sierra Nevada
-- ========================================================

-- 1. CREAR TABLA DE DEFINICIÓN DE ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. INSERTAR ROLES DEL SISTEMA
INSERT INTO
    public.user_roles (name, description)
VALUES (
        'Administrador',
        'Acceso total al sistema, gestión de usuarios y finanzas.'
    ),
    (
        'Colaborador',
        'Miembros de la Gilda, gestión de pedidos y contenidos.'
    ),
    (
        'Proveedor',
        'Productores de café, gestión de stock propio y fincas.'
    ),
    (
        'Usuario',
        'Cliente final, acceso a catálogo y historial de pedidos.'
    ) ON CONFLICT (name) DO NOTHING;

-- 3. ACTUALIZAR TABLA PROFILES PARA USAR EL NUEVO SISTEMA
-- Primero agregamos la columna si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role_name') THEN
        ALTER TABLE public.profiles ADD COLUMN role_name TEXT DEFAULT 'Usuario' REFERENCES public.user_roles(name);
    END IF;
END $$;

-- 4. ACTUALIZAR EL TRIGGER DE REGISTRO AUTOMÁTICO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role_name, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'Usuario', -- Rol por defecto para nuevos registros
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. VISTA DE CONVENIENCIA (Para que el frontend siga leyendo 'role')
-- Esto permite no romper el código actual que busca .role
-- Opcional: Podríamos renombrar la columna en la tabla directamente.

-- COMENTARIOS DE SEGURIDAD
COMMENT ON
TABLE public.user_roles IS 'Definición maestra de roles del sistema Origen Sierra Nevada';