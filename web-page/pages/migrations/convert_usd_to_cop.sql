-- ================================================================================
-- MIGRACIÓN: Convertir precios de USD a COP
-- Proyecto: Origen Sierra Nevada
-- Fecha: 2026-02-06
-- Descripción: Esta migración convierte todos los precios en la tabla 'products'
--              de USD a COP usando una tasa de conversión de 1 USD = 4000 COP.
-- ================================================================================

-- ⚠️ IMPORTANTE: Ejecutar esto SOLO UNA VEZ
-- ⚠️ Los precios actuales en USD se multiplicarán por 4000

-- Primero, verificar los precios actuales (DRY RUN)
SELECT 
    id, 
    name->>'es' as nombre,
    price as precio_actual_usd,
    price * 4000 as precio_nuevo_cop
FROM products
ORDER BY id;

-- Si los datos se ven correctos, ejecutar la actualización:
/*
UPDATE products
SET price = price * 4000
WHERE price < 1000; -- Solo actualizar precios que parecen estar en USD (menores a 1000)
*/

-- Versión más segura con logs
DO $$
DECLARE
    affected_rows INTEGER;
BEGIN
    -- Contar cuántos productos serán afectados
    SELECT COUNT(*) INTO affected_rows 
    FROM products 
    WHERE price < 1000;
    
    RAISE NOTICE 'Productos a actualizar: %', affected_rows;
    
    -- Ejecutar la actualización
    UPDATE products
    SET price = price * 4000
    WHERE price < 1000;
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    RAISE NOTICE 'Productos actualizados: %', affected_rows;
END $$;

-- Verificar los nuevos precios
SELECT 
    id, 
    name->>'es' as nombre,
    category,
    price as precio_cop,
    ROUND(price / 4000, 2) as precio_usd_equivalente
FROM products
ORDER BY id;

-- ================================================================================
-- NOTA: Si también tienes precios en la columna 'variants', necesitarás 
-- actualizarlos por separado con una lógica similar:
/*
UPDATE products
SET variants = (
    SELECT jsonb_agg(
        v || jsonb_build_object('price', (v->>'price')::numeric * 4000)
    )
    FROM jsonb_array_elements(variants) AS v
)
WHERE variants IS NOT NULL AND jsonb_array_length(variants) > 0;
*/
-- ================================================================================
