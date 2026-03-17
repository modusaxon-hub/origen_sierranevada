
import { supabase } from './supabaseClient';
import { Product, ProductVariant } from '../shared/types';

export const productService = {
    getAllProducts: async (limit: number = 100, offset: number = 0) => {
        // Optimized: Load products WITH variants in a single query
        const { data, error } = await supabase
            .from('products')
            .select('*, variants:product_variants(*)')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error || !data) {
            console.error('Error fetching products with variants:', error);
            return { data: [] as Product[], error };
        }

        return { data: data as Product[], error: null };
    },

    getProductsByCategory: async (category: string, limit: number = 100) => {
        // Optimized: Filter by category server-side AND load variants
        const { data, error } = await supabase
            .from('products')
            .select('*, variants:product_variants(*)')
            .eq('category', category)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error || !data) {
            console.error(`Error fetching products for category ${category}:`, error);
            return { data: [] as Product[], error };
        }

        return { data: data as Product[], error: null };
    },

    getProductById: async (id: string) => {
        // Optimized: Load product WITH variants in a single query using join
        const { data, error } = await supabase
            .from('products')
            .select('*, variants:product_variants(*)')
            .eq('id', id)
            .single();

        if (!data) return { data: null, error };

        return {
            data: data as Product | null,
            error
        };
    },

    createProduct: async (product: Omit<Product, 'id' | 'created_at'>) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, created_at, variants, product_variants, ...productData } = product as any;

        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();

        if (!error && data && variants?.length) {
            const { error: variantError } = await supabase.from('product_variants').insert(
                variants.map((v: ProductVariant) => ({
                    product_id: (data as any).id,
                    name: v.name,
                    price: v.price,
                    stock: v.stock,
                    grind: v.grind || null,
                    units_per_package: v.units_per_package || null,
                    weight_per_unit: v.weight_per_unit || null
                }))
            );
            if (variantError) return { data: null, error: variantError };
        }
        return { data: data ? [data] : null, error };
    },

    updateProduct: async (id: string, updates: Partial<Product>) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, created_at: _ca, variants, product_variants, ...productData } = updates as any;

        const { data, error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id)
            .select()
            .single();

        if (!error && variants !== undefined) {
            // Sincronización inteligente de variantes
            // 1. Obtener IDs actuales para saber cuáles eliminar
            const { data: currentVariants } = await supabase
                .from('product_variants')
                .select('id')
                .eq('product_id', id);

            const currentIds = currentVariants?.map(v => v.id) || [];

            // Filtramos los IDs que vienen del form. 
            // Las variantes nuevas tienen IDs temporales (cortos) generados por JS, 
            // las existentes tienen UUIDs reales (36 caracteres).
            const newIds = variants
                .map(v => v.id)
                .filter(vid => vid && vid.length > 20);

            // 2. Eliminar las que ya no están en la lista
            const idsToDelete = currentIds.filter(cid => !newIds.includes(cid));
            if (idsToDelete.length > 0) {
                const { error: delError } = await supabase
                    .from('product_variants')
                    .delete()
                    .in('id', idsToDelete);

                if (delError) {
                    console.warn("[ProductService] Algunas variantes no se eliminaron (posiblemente vinculadas a pedidos):", delError.message);
                    // No bloqueamos el proceso, preferimos que queden huérfanas a que falle toda la actualización
                }
            }

            // 3. Upsert (Actualizar existentes y Crear nuevas)
            if (variants.length > 0) {
                const variantsToUpsert = variants.map((v: ProductVariant) => {
                    const isExisting = v.id && v.id.length > 20;
                    return {
                        ...(isExisting ? { id: v.id } : {}), // Solo incluimos ID si es real de DB
                        product_id: id,
                        name: v.name,
                        price: v.price,
                        stock: v.stock,
                        grind: v.grind || null,
                        units_per_package: v.units_per_package || null,
                        weight_per_unit: v.weight_per_unit || null
                    };
                });

                const { error: upsError } = await supabase
                    .from('product_variants')
                    .upsert(variantsToUpsert);

                if (upsError) {
                    console.error("[ProductService] Error al sincronizar variantes:", upsError);
                    return { data: null, error: upsError };
                }
            }
        } else if (error && error.message.includes('multiple (or no) rows returned')) {
            // Handle case where updating a fallback product that doesn't exist in DB
            return { data: null, error: { ...error, message: 'El producto no existe en la base de datos. Intenta crearlo como un nuevo producto.' } };
        }
        return { data: data ? [data] : null, error };
    },

    deleteProduct: async (id: string) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        return { error };
    },

    uploadImage: async (file: File) => {
        let fileExt = file.name.split('.').pop() || 'png';
        // Limpiamos los caracteres especiales para evitar errores en Supabase como "Invalid key"
        fileExt = fileExt.replace(/[^a-zA-Z0-9]/g, '');

        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (error) return { data: null, error };

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        return { data: publicUrl, error: null };
    }
};
