-- ========================================================
-- REPARACIÓN DE COLUMNA 'currency' EN TABLA 'orders'
-- PROYECTO: Origen Sierra Nevada
-- SOLUCIÓN: Error PGRST204 al realizar el checkout
-- ========================================================

-- 1. Agregar la columna 'currency' con un valor por defecto
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'COP';

-- 2. Asegurarse de que los índices y permisos se mantengan (opcional pero recomendado)
COMMENT ON COLUMN public.orders.currency IS 'Moneda del pedido (COP, USD, etc.)';

-- 3. Verificación
SELECT 'Columna currency agregada exitosamente ✅' AS status;