
import { supabase } from './supabaseClient';
import { Product } from '../types';

export const productService = {
    getAllProducts: async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        return { data: data as Product[] || [], error };
    },

    getProductById: async (id: string) => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        return { data: data as Product | null, error };
    },

    createProduct: async (product: Omit<Product, 'id' | 'created_at'>) => {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select();

        return { data, error };
    },

    updateProduct: async (id: string, updates: Partial<Product>) => {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select();

        return { data, error };
    },

    deleteProduct: async (id: string) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        return { error };
    },

    uploadImage: async (file: File) => {
        const fileExt = file.name.split('.').pop();
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
