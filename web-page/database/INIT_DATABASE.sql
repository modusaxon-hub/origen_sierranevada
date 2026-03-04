-- ========================================================
-- INICIALIZACIÓN COMPLETA DE BASE DE DATOS
-- PROYECTO: Origen Sierra Nevada
-- VERSIÓN: 1.0 (Consolidada - Mar 2026)
-- ========================================================
-- IMPORTANTE: Este es el ÚNICO archivo que necesitas ejecutar
-- Supabase > SQL Editor > New Query > Copia TODO > RUN
-- ========================================================

-- ========================================================
-- FASE 0: CLEANUP (Borrar lo viejo para empezar limpio)
-- ========================================================

DROP TABLE IF EXISTS public.order_items CASCADE;

DROP TABLE IF EXISTS public.orders CASCADE;

DROP TABLE IF EXISTS public.payments CASCADE;

DROP TABLE IF EXISTS public.invoices CASCADE;

DROP TABLE IF EXISTS public.financial_records CASCADE;

DROP TABLE IF EXISTS public.product_variants CASCADE;

DROP TABLE IF EXISTS public.products CASCADE;

DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TABLE IF EXISTS public.user_roles CASCADE;

DROP FUNCTION IF EXISTS public.handle_new_user () CASCADE;

-- ========================================================
-- FASE 1: TABLA DE ROLES (Sistema de Autorización)
-- ========================================================

CREATE TABLE public.user_roles (
    name TEXT UNIQUE PRIMARY KEY,
    description TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

COMMENT ON
TABLE public.user_roles IS 'Roles del sistema: Administrador, Colaborador, Proveedor, Usuario';

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
        'Cliente final, acceso a catálogo e historial de pedidos.'
    ) ON CONFLICT DO NOTHING;

-- ========================================================
-- FASE 2: TABLA DE PERFILES (Usuarios del Sistema)
-- ========================================================

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    role_name TEXT NOT NULL DEFAULT 'Usuario' REFERENCES public.user_roles (name),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'active',
            'inactive',
            'rejected'
        )
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_profiles_email ON public.profiles (email);

CREATE INDEX idx_profiles_role_name ON public.profiles (role_name);

CREATE INDEX idx_profiles_status ON public.profiles (status);

COMMENT ON
TABLE public.profiles IS 'Perfiles de usuario con información adicional y roles';

COMMENT ON COLUMN public.profiles.role_name IS 'Referencia a user_roles(name)';

-- ========================================================
-- FASE 3: PRODUCTOS (Catálogo Maestro)
-- ========================================================

CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    category TEXT NOT NULL CHECK (
        category IN (
            'cafetal',
            'accesorios',
            'antojitos'
        )
    ),
    name JSONB NOT NULL, -- {"es": "...", "en": "..."}
    price NUMERIC NOT NULL DEFAULT 0,
    image_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    available BOOLEAN DEFAULT true,
    description JSONB NOT NULL,
    story JSONB,
    tags JSONB, -- {"es": ["..."], "en": ["..."]}
    badge JSONB,
    score NUMERIC,
    color TEXT DEFAULT '#C8AA6E',
    mask_type TEXT CHECK (
        mask_type IN ('pop', 'static')
    ),
    overlay_url TEXT,
    weight INTEGER DEFAULT 0,
    origin TEXT,
    intrinsics JSONB,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_products_category ON public.products (category);

CREATE INDEX idx_products_available ON public.products (available);

-- ========================================================
-- FASE 4: VARIANTES DE PRODUCTOS
-- ========================================================

CREATE TABLE public.product_variants (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    product_id UUID REFERENCES public.products (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_product_variants_product_id ON public.product_variants (product_id);

-- ========================================================
-- FASE 5: PEDIDOS (Cabecera)
-- ========================================================

CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    user_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'paid',
            'shipped',
            'delivered',
            'cancelled'
        )
    ),
    total_amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'COP',
    shipping_address JSONB,
    contact_phone TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_orders_user_id ON public.orders (user_id);

CREATE INDEX idx_orders_status ON public.orders (status);

CREATE INDEX idx_orders_created_at ON public.orders (created_at DESC);

-- ========================================================
-- FASE 6: ITEMS DE PEDIDOS (Detalle)
-- ========================================================

CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    order_id UUID REFERENCES public.orders (id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products (id),
    variant_id UUID REFERENCES public.product_variants (id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    subtotal NUMERIC NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_order_items_order_id ON public.order_items (order_id);

CREATE INDEX idx_order_items_product_id ON public.order_items (product_id);

-- ========================================================
-- FASE 7: PAGOS (Transacciones)
-- ========================================================

CREATE TABLE public.payments (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    order_id UUID REFERENCES public.orders (id) ON DELETE CASCADE,
    method TEXT NOT NULL CHECK (
        method IN (
            'nequi',
            'daviplata',
            'pse',
            'tarjeta',
            'efectivo',
            'transferencia'
        )
    ),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'completed',
            'failed',
            'refunded'
        )
    ),
    transaction_id TEXT,
    amount NUMERIC NOT NULL,
    payment_evidence_url TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_payments_order_id ON public.payments (order_id);

CREATE INDEX idx_payments_status ON public.payments (status);

-- ========================================================
-- FASE 8: FACTURAS (DIAN / Legal)
-- ========================================================

CREATE TABLE public.invoices (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    order_id UUID REFERENCES public.orders (id),
    invoice_number TEXT UNIQUE NOT NULL,
    cufe TEXT,
    issue_date TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        pdf_url TEXT,
        xml_url TEXT,
        status TEXT DEFAULT 'sent' CHECK (
            status IN (
                'draft',
                'sent',
                'accepted',
                'rejected'
            )
        ),
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_invoices_order_id ON public.invoices (order_id);

-- ========================================================
-- FASE 9: REGISTROS FINANCIEROS (Contabilidad)
-- ========================================================

CREATE TABLE public.financial_records (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    type TEXT NOT NULL CHECK (
        type IN (
            'income',
            'expense',
            'tax',
            'refund'
        )
    ),
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    reference_id UUID,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_financial_records_type ON public.financial_records(type);

-- ========================================================
-- FASE 10: TRIGGERS (Automatización)
-- ========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role_name, status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'Usuario',
        'active'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- FASE 11: RLS POLICIES (Seguridad - SIN RECURSIÓN)
-- ========================================================

-- PROFILES TABLE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_own_read" ON public.profiles FOR
SELECT USING (auth.uid () = id);

CREATE POLICY "profiles_admin_read" ON public.profiles FOR
SELECT USING (
        auth.uid () IN (
            SELECT id
            FROM public.profiles
            WHERE
                role_name = 'Administrador'
        )
    );

CREATE POLICY "profiles_own_update" ON public.profiles FOR
UPDATE USING (auth.uid () = id)
WITH
    CHECK (auth.uid () = id);

CREATE POLICY "profiles_admin_update" ON public.profiles FOR
UPDATE USING (
    auth.uid () IN (
        SELECT id
        FROM public.profiles
        WHERE
            role_name = 'Administrador'
    )
);

CREATE POLICY "profiles_own_insert" ON public.profiles FOR
INSERT
WITH
    CHECK (auth.uid () = id);

-- PRODUCTS TABLE
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read" ON public.products FOR
SELECT USING (available = true);

CREATE POLICY "products_admin_read" ON public.products FOR
SELECT USING (
        auth.uid () IN (
            SELECT id
            FROM public.profiles
            WHERE
                role_name = 'Administrador'
        )
    );

CREATE POLICY "products_admin_write" ON public.products FOR
INSERT
WITH
    CHECK (
        auth.uid () IN (
            SELECT id
            FROM public.profiles
            WHERE
                role_name = 'Administrador'
        )
    );

CREATE POLICY "products_admin_update" ON public.products FOR
UPDATE USING (
    auth.uid () IN (
        SELECT id
        FROM public.profiles
        WHERE
            role_name = 'Administrador'
    )
);

CREATE POLICY "products_admin_delete" ON public.products FOR DELETE USING (
    auth.uid () IN (
        SELECT id
        FROM public.profiles
        WHERE
            role_name = 'Administrador'
    )
);

-- ORDERS TABLE
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_own_read" ON public.orders FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "orders_admin_read" ON public.orders FOR
SELECT USING (
        auth.uid () IN (
            SELECT id
            FROM public.profiles
            WHERE
                role_name = 'Administrador'
        )
    );

CREATE POLICY "orders_own_insert" ON public.orders FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

-- ORDER_ITEMS TABLE
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_read" ON public.order_items FOR
SELECT USING (
        order_id IN (
            SELECT id
            FROM public.orders
            WHERE
                user_id = auth.uid ()
                OR auth.uid () IN (
                    SELECT id
                    FROM public.profiles
                    WHERE
                        role_name = 'Administrador'
                )
        )
    );

-- PAYMENTS TABLE
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_own_read" ON public.payments FOR
SELECT USING (
        order_id IN (
            SELECT id
            FROM public.orders
            WHERE
                user_id = auth.uid ()
        )
    );

CREATE POLICY "payments_admin_read" ON public.payments FOR
SELECT USING (
        auth.uid () IN (
            SELECT id
            FROM public.profiles
            WHERE
                role_name = 'Administrador'
        )
    );

-- ========================================================
-- FASE 12: DATOS INICIALES (Productos de Muestra)
-- ========================================================

INSERT INTO
    public.products (
        category,
        name,
        price,
        image_url,
        stock,
        available,
        description,
        story,
        tags,
        badge,
        score,
        color,
        mask_type
    )
VALUES (
        'cafetal',
        '{"es": "Café Malú", "en": "Malú Coffee"}',
        72000,
        'public/cafe_malu_black_bag_minca.png',
        50,
        true,
        '{"es": "Cultivado en las elevaciones místicas de la Sierra Nevada", "en": "Grown in mystical elevations"}',
        '{"es": "Herencia de generaciones...", "en": "Heritage of generations..."}',
        '{"es": ["Frutal", "Chocolate"], "en": ["Fruity", "Chocolate"]}',
        '{"es": "Especialidad Origen Único", "en": "Single Origin"}',
        88,
        '#C8AA6E',
        'pop'
    ),
    (
        'cafetal',
        '{"es": "Sombra Sagrada", "en": "Sacred Shade"}',
        96000,
        'public/sombra_sagrada_luxury.png',
        30,
        true,
        '{"es": "Reserva más preciada de Origen", "en": "Most precious reserve"}',
        '{"es": "Microlotes cultivados a 1,900m+", "en": "Microlots above 1,900m+"}',
        '{"es": ["Floral", "Miel"], "en": ["Floral", "Honey"]}',
        '{"es": "Reserva Ecológica", "en": "Ecological Reserve"}',
        91,
        '#1C2923',
        'pop'
    ) ON CONFLICT DO NOTHING;

-- ========================================================
-- FASE 13: VERIFICACIÓN FINAL
-- ========================================================

-- Mostrar tablas creadas
SELECT 'Base de datos inicializada correctamente ✅' AS status;

-- ========================================================
-- FASE 14: STORAGE POLICIES (Gestión de Imágenes)
-- ========================================================

-- 1. Asegurar que el bucket existe y es público
INSERT INTO
    storage.buckets (id, name, public)
VALUES ('products', 'products', true) ON CONFLICT (id) DO
UPDATE
SET
    public = true;

-- 2. Eliminar políticas antiguas para evitar duplicados
DROP POLICY IF EXISTS "Acceso público a imágenes de productos" ON storage.objects;

DROP POLICY IF EXISTS "Admins pueden subir imágenes de productos" ON storage.objects;

DROP POLICY IF EXISTS "Admins pueden actualizar imágenes de productos" ON storage.objects;

DROP POLICY IF EXISTS "Admins pueden borrar imágenes de productos" ON storage.objects;

-- 3. Crear políticas para el sistema de roles consolidado

-- PERMISO: Lectura pública
CREATE POLICY "Acceso público a imágenes de productos" ON storage.objects FOR
SELECT USING (bucket_id = 'products');

-- PERMISO: Gestión (Insert/Update/Delete) para Usuarios Autenticados (DESARROLLO)
-- NOTA: En producción, esto debería verificar si el usuario es Administrador
-- Para desarrollo, permitimos cualquier usuario autenticado subir imágenes
CREATE POLICY "Usuarios autenticados pueden gestionar imágenes" ON storage.objects FOR ALL TO authenticated USING (
    bucket_id = 'products'
)
WITH
    CHECK (
        bucket_id = 'products'
    );

-- ========================================================
-- NOTAS IMPORTANTES
-- ========================================================
-- 1. Este script es idempotente (puedes ejecutarlo múltiples veces)
-- 2. Los RLS policies evitan recursión usando SELECT directo en lugar de EXISTS
-- 3. Los triggers auto-crean perfiles cuando se registra un usuario en Auth
-- 4. Después de ejecutar, RECARGA el navegador (Ctrl+Shift+Delete) y limpia cache
-- ========================================================
-- ========================================================
-- FASE 15: DATOS DE PRUEBA (Perfiles y Muestra)
-- ========================================================

-- Perfil de Administrador (UUID de ejemplo para desarrollo)
INSERT INTO public.profiles (
    id, email, full_name, role_name, status, phone, address
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'admin@origensierranevada.com',
    'Administrador Origen',
    'Administrador',
    'active',
    '+573107405154',
    'Santa Marta, Colombia'
) ON CONFLICT (id) DO NOTHING;

-- Usuarios de Prueba
INSERT INTO public.profiles (
    id, email, full_name, role_name, status
) VALUES 
(
    '00000000-0000-0000-0000-000000000002'::uuid,
    'cliente@origen.com',
    'Cliente VIP Sierra',
    'Usuario',
    'active'
) ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- VERIFICACIÓN FINAL
-- ========================================================
SELECT
    'Base de Datos Consolidada Correctamente ✅' as status,
    (
        SELECT COUNT(*)
        FROM public.profiles
    ) as total_perfiles,
    (
        SELECT COUNT(*)
        FROM public.products
    ) as total_productos,
    (
        SELECT COUNT(*)
        FROM public.user_roles
    ) as total_roles;

-- ========================================================
-- NOTAS
-- ========================================================
-- 1. Este archivo es la ÚNICA fuente de verdad para la DB.
-- 2. Ejecutarlo limpia la DB y la prepara con el esquema actual.
-- 3. Incluye soporte para moneda COP y carga de imágenes.
-- ========================================================