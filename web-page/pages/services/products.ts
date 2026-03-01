
import { supabase } from './supabaseClient';
import { Product, ProductInput } from '../types';

export const PRODUCTS_TABLE = 'products';
export const PRODUCTS_BUCKET = 'products-images';

/**
 * Obtiene todos los productos ordenados por fecha de creación (más recientes primero)
 */
export const getProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from(PRODUCTS_TABLE)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    return data as Product[];
};

/**
 * Sube una imagen al bucket de productos
 */
export const uploadProductImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from(PRODUCTS_BUCKET)
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
    }

    // Obtener URL pública
    const { data } = supabase.storage
        .from(PRODUCTS_BUCKET)
        .getPublicUrl(filePath);

    return data.publicUrl;
};

/**
 * Crea un nuevo producto
 */
export const createProduct = async (product: ProductInput): Promise<Product> => {
    const { data, error } = await supabase
        .from(PRODUCTS_TABLE)
        .insert([product])
        .select()
        .single();

    if (error) {
        console.error('Error creating product:', error);
        throw error;
    }

    return data as Product;
};

/**
 * Actualiza un producto existente
 */
export const updateProduct = async (id: number, updates: Partial<ProductInput>): Promise<Product> => {
    const { data, error } = await supabase
        .from(PRODUCTS_TABLE)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating product:', error);
        throw error;
    }

    return data as Product;
};

/**
 * Elimina un producto
 * Nota: No elimina automáticamente la imagen del storage por seguridad, 
 * aunque podría implementarse si se desea limpieza total.
 */
export const deleteProduct = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from(PRODUCTS_TABLE)
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};
