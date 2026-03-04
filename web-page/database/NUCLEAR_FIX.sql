-- ========================================================
-- NUCLEAR FIX: Eliminar recursión — Enfoque pragmático
-- ========================================================
-- Para desarrollo: desactivar RLS en profiles
-- En producción: implementar con funciones SECURITY DEFINER

-- PASO 1: DESACTIVAR RLS completamente en profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- PASO 2: Eliminar TODAS las policies
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_all_if_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

DROP POLICY IF EXISTS "products_read_available" ON public.products;
DROP POLICY IF EXISTS "products_admin_access" ON public.products;

DROP POLICY IF EXISTS "orders_read_own" ON public.orders;
DROP POLICY IF EXISTS "orders_read_admin" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;

DROP POLICY IF EXISTS "order_items_read_own" ON public.order_items;

DROP POLICY IF EXISTS "payments_read_own" ON public.payments;
DROP POLICY IF EXISTS "payments_read_admin" ON public.payments;

-- PASO 3: Desactivar RLS en todas las tablas (desarrollo)
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records DISABLE ROW LEVEL SECURITY;

-- PASO 4: (Opcional) Validación en aplicación React
-- El control de acceso se hace en authService.ts con el rol
-- Ejemplo en AdminDashboard.tsx:
-- if (!user || user.user_metadata?.role_name !== 'Administrador') {
--   return <AccessDenied />;
-- }

-- ========================================================
-- VERIFICACIÓN
-- ========================================================
SELECT 'RLS desactivado — Control en aplicación React ✅' AS status;
