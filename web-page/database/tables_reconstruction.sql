-- ========================================================
-- RECONSTRUCCIÓN DE BASE DE DATOS — FASE 1
-- PROYECTO: Origen Sierra Nevada
-- ESTÁNDAR: MODUS AXON PRECISION
-- ========================================================

-- 1. TABLA: products (Catálogo Maestro)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('cafetal', 'accesorios', 'antojitos')),
    name JSONB NOT NULL, -- { "es": "...", "en": "..." }
    price NUMERIC NOT NULL DEFAULT 0,
    image_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    description JSONB NOT NULL,
    story JSONB,
    tags JSONB, -- { "es": ["..."], "en": ["..."] }
    badge JSONB,
    score NUMERIC,
    color TEXT DEFAULT '#C8AA6E',
    mask_type TEXT CHECK (mask_type IN ('pop', 'static')),
    overlay_url TEXT,
    weight INTEGER DEFAULT 0,
    origin TEXT,
    available BOOLEAN DEFAULT true,
    intrinsics JSONB, -- Opciones de molienda, personalidad, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABLA: product_variants (Presentaciones: 250g, 500g, etc.)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABLA: orders (Cabecera de Pedidos)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
    total NUMERIC NOT NULL,
    shipping_address JSONB,
    contact_phone TEXT,
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLA: order_items (Detalle de Pedidos)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    variant_id UUID REFERENCES public.product_variants(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    subtotal NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABLA: payments (Transacciones Financieras)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id),
    method TEXT NOT NULL CHECK (method IN ('nequi', 'daviplata', 'pse', 'targeta', 'efectivo')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id TEXT, -- Referencia externa
    amount NUMERIC NOT NULL,
    payment_evidence_url TEXT, -- Link a captura de QR
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABLA: invoices (Facturación DIAN / Legal)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id),
    invoice_number TEXT UNIQUE NOT NULL, -- Prefijo + Número
    cufe TEXT, -- Código Único de Factura Electrónica
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    pdf_url TEXT,
    xml_url TEXT,
    status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. TABLA: financial_records (Libro Mayor / Contabilidad Interna)
CREATE TABLE IF NOT EXISTS public.financial_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'tax', 'refund')),
    category TEXT NOT NULL, -- e.g., 'sale', 'utility', 'shipping_cost'
    amount NUMERIC NOT NULL,
    description TEXT,
    reference_id UUID, -- Puede apuntar a order_id o payment_id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. TABLA: audit_logs (Seguridad y Trazabilidad)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL, -- e.g., 'LOGIN', 'DELETE_PRODUCT', 'UPDATE_PRICE'
    table_name TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. TABLA: inventory_transactions (Control de Stock)
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id),
    variant_id UUID REFERENCES public.product_variants(id),
    change_amount INTEGER NOT NULL, -- Positivo (entrada), Negativo (salida)
    reason TEXT NOT NULL, -- e.g., 'sale', 'restock', 'return', 'loss'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. TABLA: user_notifications
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    type TEXT CHECK (type IN ('order_update', 'promo', 'security', 'system')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================================
-- RLS CONFIGURATION (Row Level Security)
-- ========================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para productos
CREATE POLICY "Public Read Products" ON public.products FOR
SELECT USING (available = true);

CREATE POLICY "Public Read Variants" ON public.product_variants FOR
SELECT USING (true);

-- Políticas de pedidos (propietario o admin)
CREATE POLICY "Orders Owner/Admin" ON public.orders FOR ALL USING (
    auth.uid () = user_id
    OR EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE
            id = auth.uid ()
            AND role = 'admin'
    )
);

-- Políticas de auditoría (solo admin)
CREATE POLICY "Admins Audit" ON public.audit_logs FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE
                id = auth.uid ()
                AND role = 'admin'
        )
    );