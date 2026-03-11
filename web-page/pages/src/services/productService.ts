
import { supabase } from './supabaseClient';
import { Product, ProductVariant } from '../shared/types';

export const productService = {
    getAllProducts: async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*, product_variants(*)')
            .order('created_at', { ascending: false });

        if (data) {
            data.forEach((p: any) => { p.variants = p.product_variants || []; });
        }
        return { data: data as Product[] || [], error };
    },

    getProductById: async (id: string) => {
        const { data, error } = await supabase
            .from('products')
            .select('*, product_variants(*)')
            .eq('id', id)
            .single();

        if (data) (data as any).variants = (data as any).product_variants || [];
        return { data: data as Product | null, error };
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
            const { error: delError } = await supabase.from('product_variants').delete().eq('product_id', id);
            if (delError) return { data: null, error: delError };

            if (variants.length > 0) {
                const { error: insError } = await supabase.from('product_variants').insert(
                    variants.map((v: ProductVariant) => ({
                        product_id: id,
                        name: v.name,
                        price: v.price,
                        stock: v.stock,
                        grind: v.grind || null,
                        units_per_package: v.units_per_package || null,
                        weight_per_unit: v.weight_per_unit || null
                    }))
                );
                if (insError) return { data: null, error: insError };
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
