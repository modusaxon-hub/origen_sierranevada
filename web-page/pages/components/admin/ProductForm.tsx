import React, { useState } from 'react';
import { Product, ProductInput, LanguageCode } from '../../types';
import { uploadProductImage, createProduct, updateProduct } from '../../services/products';
import { Upload, X, Save, Globe, Image as ImageIcon, Type, Loader2 } from 'lucide-react';

interface ProductFormProps {
    initialData?: Product;
    onSuccess?: (product: Product) => void;
    onCancel?: () => void;
}

const INITIAL_STATE: ProductInput = {
    category: 'coffee',
    name: { es: '', en: '' },
    price: 0,
    image_url: '',
    stock: 100,
    description: { es: '', en: '' },
    story: { es: '', en: '' },
    tags: { es: [], en: [] },
    badge: { es: '', en: '' },
    score: undefined,
    color: '#E0A367',
    mask_type: 'pop'
};

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSuccess, onCancel }) => {
    // Si viene initialData, lo convertimos a ProductInput (ignorando campos de DB como created_at)
    const [formData, setFormData] = useState<ProductInput>(initialData ? {
        category: initialData.category,
        name: initialData.name,
        price: initialData.price,
        image_url: initialData.image_url,
        stock: initialData.stock,
        description: initialData.description,
        story: initialData.story,
        tags: initialData.tags,
        badge: initialData.badge,
        score: initialData.score,
        color: initialData.color,
        mask_type: initialData.mask_type,
        overlay_url: initialData.overlay_url
    } : INITIAL_STATE);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [activeLang, setActiveLang] = useState<LanguageCode>('es');

    const handleChange = (field: keyof ProductInput, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLocalizedChange = (field: 'name' | 'description' | 'story' | 'badge', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [activeLang]: value }
        }));
    };

    const handleTagsChange = (value: string) => {
        // Separa por comas
        const tags = value.split(',').map(t => t.trim()).filter(Boolean);
        setFormData(prev => ({
            ...prev,
            tags: { ...prev.tags, [activeLang]: tags } as any
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploadingImage(true);
        setError(null);

        try {
            const url = await uploadProductImage(file);
            handleChange('image_url', url);
        } catch (err: any) {
            console.error(err);
            setError('Error al subir imagen. ¿Existe el bucket "products-images" en Supabase?');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Validaciones básicas
            if (!formData.name.es || !formData.price || !formData.image_url) {
                throw new Error('Nombre (ES), Precio e Imagen son obligatorios.');
            }

            let result: Product;
            if (initialData) {
                result = await updateProduct(initialData.id, formData);
            } else {
                result = await createProduct(formData);
            }

            if (onSuccess) onSuccess(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al guardar el producto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-[#E0A367]/20 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-serif text-[#1C2923]">
                    {initialData ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveLang('es')}
                        className={`px-3 py-1 rounded text-sm transition-colors ${activeLang === 'es' ? 'bg-[#1C2923] text-[#D4AF37]' : 'bg-gray-100 text-gray-500'}`}
                    >
                        ES
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveLang('en')}
                        className={`px-3 py-1 rounded text-sm transition-colors ${activeLang === 'en' ? 'bg-[#1C2923] text-[#D4AF37]' : 'bg-gray-100 text-gray-500'}`}
                    >
                        EN
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                    <X size={16} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna Izquierda: Datos Generales e Imagen */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#C05D2D] transition-colors">
                            {formData.image_url ? (
                                <div className="relative group">
                                    <img src={formData.image_url} alt="Preview" className="h-48 w-full object-contain mx-auto" />
                                    <button
                                        type="button"
                                        onClick={() => handleChange('image_url', '')}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="py-8">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">
                                        {uploadingImage ? 'Subiendo...' : 'Arrastra o selecciona una imagen'}
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={e => handleChange('price', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05D2D] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={e => handleChange('stock', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05D2D] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            value={formData.category}
                            onChange={e => handleChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05D2D] focus:border-transparent outline-none"
                        >
                            <option value="coffee">Café</option>
                            <option value="accessories">Accesorios</option>
                            <option value="derivatives">Derivados</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Puntaje SCA (Opcional)</label>
                            <input
                                type="number"
                                value={formData.score || ''}
                                onChange={e => handleChange('score', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05D2D] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color (Hex)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={e => handleChange('color', e.target.value)}
                                    className="h-10 w-10 p-0 border-0 rounded overflow-hidden cursor-pointer"
                                />
                                <span className="text-sm text-gray-500 uppercase">{formData.color}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Contenido Localizado (Tabs implícitas por estado activeLang) */}
                <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 text-[#C05D2D] font-medium text-sm">
                        <Globe size={16} />
                        Editando en: {activeLang === 'es' ? 'Español' : 'English'}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                        <input
                            type="text"
                            value={formData.name[activeLang]}
                            onChange={e => handleLocalizedChange('name', e.target.value)}
                            placeholder={activeLang === 'es' ? 'Ej: Café Malu' : 'Ex: Malu Coffee'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05D2D] focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Badge / Etiqueta</label>
                        <input
                            type="text"
                            value={formData.badge?.[activeLang] || ''}
                            onChange={e => handleLocalizedChange('badge', e.target.value)}
                            placeholder={activeLang === 'es' ? 'Ej: Especialidad' : 'Ex: Specialty'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05D2D] focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta</label>
                        <textarea
                            rows={3}
                            value={formData.description?.[activeLang] || ''}
                            onChange={e => handleLocalizedChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05D2D] focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Historia Completa</label>
                        <textarea
                            rows={5}
                            value={formData.story?.[activeLang] || ''}
                            onChange={e => handleLocalizedChange('story', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05D2D] focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separados por coma)</label>
                        <input
                            type="text"
                            value={formData.tags?.[activeLang]?.join(', ') || ''}
                            onChange={e => handleTagsChange(e.target.value)}
                            placeholder={activeLang === 'es' ? 'Ej: Frutal, Cítrico' : 'Ex: Fruity, Citrus'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C05D2D] focus:border-transparent outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-[#1C2923] text-[#D4AF37] rounded-lg hover:bg-[#1C2923]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading || uploadingImage}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Guardar Producto
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};
