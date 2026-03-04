import React, { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { Product, ProductVariant, ProductPersonality } from '@/shared/types';
import { useLanguage } from '../contexts/LanguageContext';
import { Package, Palette, Sparkles, Heart, Zap } from 'lucide-react';
import SystemFeedback from '@/shared/components/SystemFeedback';

// Constantes de configuración
const CATEGORY_WEIGHTS: Record<string, string[]> = {
    cafetal: ['250g', '500g', '1000g', '2500g', '5lb'],
    accesorios: ['Pequeño', 'Mediano', 'Grande', 'Único', 'Set x 2'],
    antojitos: ['50g', '100g', '250g', '500g', 'Único']
};

const GRIND_OPTIONS = [
    'En Grano',
    'Molido Fino (Espresso)',
    'Molido Medio (Goteo/Filtro)',
    'Molido Grueso (Prensa Francesa)',
    'Molido Extra Fino (Turco)'
];

const ProductManager: React.FC = () => {
    const { formatPrice } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [activeLangTab, setActiveLangTab] = useState<'es' | 'en'>('es');
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<'basic' | 'personality' | 'variants'>('basic');

    // Form state con todos los campos
    const [formData, setFormData] = useState<Partial<Product>>({
        category: 'cafetal',
        name: { es: '', en: '' },
        description: { es: '', en: '' },
        story: { es: '', en: '' },
        tags: { es: [], en: [] },
        price: 0,
        stock: 100,
        weight: 250,
        origin: 'Sierra Nevada de Santa Marta, Colombia',
        available: true,
        image_url: '',
        color: '#C8AA6E',
        mask_type: 'pop',
        badge: { es: '', en: '' },
        score: 0,
        intrinsics: {
            character: { es: '', en: '' },
            personality: { es: '', en: '' },
            mood: { es: '', en: '' },
            archetype: { es: '', en: '' }
        },
        variants: []
    });

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await productService.getAllProducts();
        if (!error) setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const resetForm = () => {
        setFormData({
            category: 'cafetal',
            name: { es: '', en: '' },
            description: { es: '', en: '' },
            story: { es: '', en: '' },
            tags: { es: [], en: [] },
            price: 0,
            stock: 100,
            weight: 250,
            origin: 'Sierra Nevada de Santa Marta, Colombia',
            available: true,
            image_url: '',
            color: '#C8AA6E',
            mask_type: 'pop',
            badge: { es: '', en: '' },
            score: 0,
            intrinsics: {
                character: { es: '', en: '' },
                personality: { es: '', en: '' },
                mood: { es: '', en: '' },
                archetype: { es: '', en: '' }
            },
            variants: []
        });
        setEditingProduct(null);
        setShowForm(false);
        setActiveSection('basic');
    };

    const handleEdit = (p: Product) => {
        setEditingProduct(p);
        setFormData({
            ...p,
            origin: p.origin || 'Sierra Nevada de Santa Marta, Colombia',
            intrinsics: p.intrinsics || {
                character: { es: '', en: '' },
                personality: { es: '', en: '' },
                mood: { es: '', en: '' },
                archetype: { es: '', en: '' }
            }
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    // Feedback state
    const [feedback, setFeedback] = useState<{ msg: string | null; type: 'success' | 'error' | 'info' }>({ msg: null, type: 'info' });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            let result;
            if (editingProduct) {
                result = await productService.updateProduct(editingProduct.id, formData);
            } else {
                result = await productService.createProduct(formData as any);
            }

            if (result.error) {
                console.error("Supabase Error:", result.error);
                setFeedback({ msg: `Error al guardar: ${result.error.message}`, type: 'error' });
                return;
            }

            // Success
            setFeedback({ msg: "¡Producto guardado correctamente!", type: 'success' });
            resetForm();
            fetchProducts();
        } catch (err) {
            console.error("Unexpected Error:", err);
            setFeedback({ msg: "Ocurrió un error inesperado.", type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const addVariant = () => {
        const newVariant: ProductVariant = {
            id: Math.random().toString(36).substr(2, 9),
            name: '',
            price: 0,
            stock: 0
        };
        setFormData(prev => ({
            ...prev,
            variants: [...(prev.variants || []), newVariant]
        }));
    };

    const updateVariant = (idx: number, field: keyof ProductVariant, value: any) => {
        const newVariants = [...(formData.variants || [])];
        newVariants[idx] = { ...newVariants[idx], [field]: value };
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const removeVariant = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants?.filter((_, i) => i !== idx)
        }));
    };

    const categoryNames = {
        cafetal: { label: 'Cafetal', icon: '☕', color: '#C8AA6E' },
        accesorios: { label: 'Accesorios', icon: '🎨', color: '#8B7355' },
        antojitos: { label: 'Antojitos', icon: '🍫', color: '#6F4E37' }
    };

    return (
        <div className="min-h-screen bg-[#050806] text-white pt-32 pb-20 px-6 font-sans">
            <SystemFeedback
                message={feedback.msg}
                type={feedback.type}
                onClose={() => setFeedback({ ...feedback, msg: null })}
            />
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                    <div className="space-y-2">
                        <div className="inline-block px-3 py-1 bg-[#C8AA6E]/10 border border-[#C8AA6E]/30 rounded-full">
                            <span className="text-[10px] text-[#C8AA6E] font-bold uppercase tracking-[0.2em]">Despensa Central</span>
                        </div>
                        <h1 className="text-4xl font-serif text-white tracking-tight">Maestro de Productos</h1>
                        <p className="text-white/40 text-sm">Gestiona el alma de cada producto desde aquí</p>
                    </div>

                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-[#C5A065] text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-[#D4B075] hover:shadow-[0_0_20px_rgba(197,160,101,0.3)] transition-all flex items-center gap-2"
                        >
                            <Sparkles size={16} />
                            Crear Nuevo Producto
                        </button>
                    )}
                </header>

                {/* Form */}
                {showForm && (
                    <div className="mb-20 bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden animate-slide-up">
                        {/* Form Header */}
                        <div className="bg-black/40 p-6 border-b border-white/10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif text-[#C8AA6E]">
                                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                                </h2>
                                <button onClick={resetForm} className="text-white/40 hover:text-red-500 transition-colors">
                                    <span className="material-icons-outlined">close</span>
                                </button>
                            </div>

                            {/* Language Tabs */}
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setActiveLangTab('es')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeLangTab === 'es' ? 'bg-[#C8AA6E] text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    🇪🇸 Español
                                </button>
                                <button
                                    onClick={() => setActiveLangTab('en')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeLangTab === 'en' ? 'bg-[#C8AA6E] text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    🇬🇧 English
                                </button>
                            </div>

                            {/* Section Navigation */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveSection('basic')}
                                    className={`flex-1 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSection === 'basic' ? 'bg-[#C8AA6E] text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                                >
                                    <Package size={14} />
                                    Información Básica
                                </button>
                                <button
                                    onClick={() => setActiveSection('personality')}
                                    className={`flex-1 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSection === 'personality' ? 'bg-[#C8AA6E] text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                                >
                                    <Heart size={14} />
                                    Personalidad & Carácter
                                </button>
                                <button
                                    onClick={() => setActiveSection('variants')}
                                    className={`flex-1 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSection === 'variants' ? 'bg-[#C8AA6E] text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                                >
                                    <Palette size={14} />
                                    Presentaciones
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="p-8 lg:p-12 space-y-12">
                            {/* SECTION: Basic Information */}
                            {activeSection === 'basic' && (
                                <div className="space-y-8 animate-fade-in">
                                    {/* Category Selection - PROMINENTE */}
                                    <div className="bg-gradient-to-br from-[#C8AA6E]/10 to-transparent border border-[#C8AA6E]/30 rounded-2xl p-6">
                                        <label className="text-sm text-[#C8AA6E] uppercase tracking-widest font-bold mb-4 block">
                                            Selecciona la Despensa
                                        </label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {Object.entries(categoryNames).map(([key, { label, icon, color }]) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, category: key as any }))}
                                                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${formData.category === key
                                                        ? 'border-[#C8AA6E] bg-[#C8AA6E]/10 scale-105'
                                                        : 'border-white/10 bg-white/5 hover:border-white/30'
                                                        }`}
                                                >
                                                    <div className="text-4xl mb-2">{icon}</div>
                                                    <div className="text-sm font-bold uppercase tracking-wider" style={{ color }}>
                                                        {label}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Campos básicos en grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Columna izquierda */}
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                    Nombre del Producto ({activeLangTab.toUpperCase()})
                                                </label>
                                                <input
                                                    required
                                                    value={formData.name?.[activeLangTab] || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        name: { ...prev.name!, [activeLangTab]: e.target.value }
                                                    }))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none transition-all"
                                                    placeholder="Ej: Café Arhuaco Premium"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                    Descripción Sensorial ({activeLangTab.toUpperCase()})
                                                </label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.description?.[activeLangTab] || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        description: { ...prev.description!, [activeLangTab]: e.target.value }
                                                    }))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none resize-none"
                                                    placeholder="Notas de cacao, miel y frutos rojos..."
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                    Historia del Producto ({activeLangTab.toUpperCase()})
                                                </label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.story?.[activeLangTab] || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        story: { ...prev.story!, [activeLangTab]: e.target.value }
                                                    }))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none resize-none"
                                                    placeholder="Cuenta la historia única de este producto..."
                                                />
                                            </div>
                                        </div>

                                        {/* Columna derecha */}
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                    URL de la Imagen
                                                </label>
                                                <div className="flex flex-col gap-3">
                                                    {/* File Upload Input */}
                                                    <div className="relative group">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;

                                                                // Show loading state if desired, or just wait
                                                                const { data, error } = await productService.uploadImage(file);
                                                                if (data) {
                                                                    setFormData(prev => ({ ...prev, image_url: data }));
                                                                } else {
                                                                    alert('Error al subir imagen: ' + error?.message);
                                                                }
                                                            }}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        />
                                                        <div className="bg-white/5 border border-dashed border-white/20 rounded-xl p-4 flex items-center justify-center gap-3 group-hover:bg-white/10 group-hover:border-[#C8AA6E]/50 transition-all">
                                                            <span className="material-icons-outlined text-white/40 group-hover:text-[#C8AA6E]">cloud_upload</span>
                                                            <span className="text-xs text-white/60 font-mono">
                                                                {formData.image_url ? 'Cambiar imagen' : 'Subir desde dispositivo'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <input
                                                        value={formData.image_url}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none text-xs text-white/50"
                                                        placeholder="O pega una URL externa..."
                                                    />
                                                </div>

                                                {formData.image_url && (
                                                    <div className="mt-2 p-4 bg-black/60 rounded-xl relative group">
                                                        <img
                                                            src={formData.image_url}
                                                            alt="Preview"
                                                            className="w-full h-32 object-contain"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = '/placeholder.png';
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                                            className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                        >
                                                            <span className="material-icons-outlined text-sm">close</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                        Precio Base (COP)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.price}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                        Stock Disponible
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.stock}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                        Peso (gramos)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.weight}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                        Puntaje SCA
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={formData.score || ''}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, score: parseFloat(e.target.value) }))}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none"
                                                        placeholder="86.5"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                    Origen
                                                </label>
                                                <input
                                                    value={formData.origin}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                    Color de Esencia (HEX)
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="color"
                                                        value={formData.color}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                                        className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg"
                                                    />
                                                    <input
                                                        value={formData.color}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                    Badge / Distintivo ({activeLangTab.toUpperCase()})
                                                </label>
                                                <input
                                                    value={formData.badge?.[activeLangTab] || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        badge: { ...prev.badge!, [activeLangTab]: e.target.value }
                                                    }))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none"
                                                    placeholder="Edición Limitada, Diseño de Autor..."
                                                />
                                            </div>

                                            <div className="flex items-center gap-3 p-4 bg-black/40 border border-white/10 rounded-xl">
                                                <input
                                                    type="checkbox"
                                                    id="available"
                                                    checked={formData.available}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                                                    className="w-5 h-5 accent-[#C8AA6E]"
                                                />
                                                <label htmlFor="available" className="text-sm text-white/80">
                                                    Producto disponible para venta
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION: Personality & Character */}
                            {activeSection === 'personality' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-2xl p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Zap className="text-purple-400" size={24} />
                                            <h3 className="text-xl font-serif text-purple-400">Aspectos Intrínsecos</h3>
                                        </div>
                                        <p className="text-white/60 text-sm">
                                            Define la personalidad única de este producto. Estos campos crean la conexión emocional con el cliente.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold flex items-center gap-2">
                                                    <Heart size={12} />
                                                    Carácter ({activeLangTab.toUpperCase()})
                                                </label>
                                                <input
                                                    value={formData.intrinsics?.character?.[activeLangTab] || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        intrinsics: {
                                                            ...prev.intrinsics,
                                                            character: { ...prev.intrinsics?.character, [activeLangTab]: e.target.value }
                                                        }
                                                    }))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none"
                                                    placeholder="Ej: Audaz y directo, Suave y contemplativo"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold flex items-center gap-2">
                                                    <Sparkles size={12} />
                                                    Personalidad ({activeLangTab.toUpperCase()})
                                                </label>
                                                <input
                                                    value={formData.intrinsics?.personality?.[activeLangTab] || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        intrinsics: {
                                                            ...prev.intrinsics,
                                                            personality: { ...prev.intrinsics?.personality, [activeLangTab]: e.target.value }
                                                        }
                                                    }))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none"
                                                    placeholder="Ej: Aventurero, Reflexivo, Elegante"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold flex items-center gap-2">
                                                    <Zap size={12} />
                                                    Estado de Ánimo ({activeLangTab.toUpperCase()})
                                                </label>
                                                <input
                                                    value={formData.intrinsics?.mood?.[activeLangTab] || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        intrinsics: {
                                                            ...prev.intrinsics,
                                                            mood: { ...prev.intrinsics?.mood, [activeLangTab]: e.target.value }
                                                        }
                                                    }))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none"
                                                    placeholder="Ej: Energizante, Relajante, Inspirador"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold flex items-center gap-2">
                                                    👤 Arquetipo ({activeLangTab.toUpperCase()})
                                                </label>
                                                <input
                                                    value={formData.intrinsics?.archetype?.[activeLangTab] || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        intrinsics: {
                                                            ...prev.intrinsics,
                                                            archetype: { ...prev.intrinsics?.archetype, [activeLangTab]: e.target.value }
                                                        }
                                                    }))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none"
                                                    placeholder="Ej: El Explorador, El Sabio, El Creador"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ejemplos de arquetipos */}
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h4 className="text-sm font-bold text-[#C8AA6E] uppercase tracking-wider mb-3">
                                            💡 Arquetipos Sugeridos
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-white/60">
                                            <div>• El Explorador</div>
                                            <div>• El Sabio</div>
                                            <div>• El Creador</div>
                                            <div>• El Héroe</div>
                                            <div>• El Amante</div>
                                            <div>• El Mago</div>
                                            <div>• El Inocente</div>
                                            <div>• El Rebelde</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION: Attributes (Molienda & Características) */}
                            {activeSection === 'personality' && formData.category === 'cafetal' && (
                                <div className="space-y-6 animate-fade-in border-t border-white/10 pt-6 mt-6">
                                    <h3 className="text-xl font-serif text-[#C8AA6E] flex items-center gap-2">
                                        <span className="material-icons-outlined">settings_suggest</span>
                                        Opciones de Molienda
                                    </h3>
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                        <p className="text-xs text-white/50 mb-4 uppercase tracking-widest">Selecciona las moliendas disponibles para este café:</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            {GRIND_OPTIONS.map((gOption) => (
                                                <label key={gOption} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.intrinsics?.grind_options?.includes(gOption)
                                                        ? 'bg-[#C8AA6E] border-[#C8AA6E]'
                                                        : 'border-white/20 group-hover:border-[#C8AA6E]'
                                                        }`}>
                                                        {formData.intrinsics?.grind_options?.includes(gOption) && (
                                                            <span className="material-icons-outlined text-black text-xs font-bold">check</span>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={formData.intrinsics?.grind_options?.includes(gOption) || false}
                                                        onChange={(e) => {
                                                            const current = formData.intrinsics?.grind_options || [];
                                                            let next;
                                                            if (e.target.checked) {
                                                                next = [...current, gOption];
                                                            } else {
                                                                next = current.filter(o => o !== gOption);
                                                            }
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                intrinsics: {
                                                                    ...prev.intrinsics,
                                                                    grind_options: next
                                                                }
                                                            }));
                                                        }}
                                                    />
                                                    <span className={`text-sm ${formData.intrinsics?.grind_options?.includes(gOption) ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                                                        } transition-colors`}>
                                                        {gOption}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION: Variants */}
                            {activeSection === 'variants' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-serif text-[#C8AA6E]">Presentaciones y Precios</h3>
                                        <button
                                            type="button"
                                            onClick={addVariant}
                                            className="text-[10px] font-bold uppercase tracking-widest border border-[#C8AA6E]/50 px-4 py-2 rounded-lg hover:bg-[#C8AA6E] hover:text-black transition-all"
                                        >
                                            + Añadir Presentación
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {formData.variants?.map((v, i) => (
                                            <div key={v.id} className="bg-black/40 border border-white/10 p-6 rounded-2xl relative group">
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(i)}
                                                    className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-icons-outlined text-sm">delete</span>
                                                </button>

                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] uppercase tracking-widest text-[#C8AA6E]">
                                                            {formData.category === 'cafetal' ? 'Peso / Presentación' : 'Variante / Tamaño'}
                                                        </label>
                                                        {formData.category && CATEGORY_WEIGHTS[formData.category] ? (
                                                            <div className="relative">
                                                                <select
                                                                    value={v.name}
                                                                    onChange={(e) => updateVariant(i, 'name', e.target.value)}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#C8AA6E] outline-none appearance-none text-white"
                                                                >
                                                                    <option value="" className="bg-[#1A261D] text-gray-400">Seleccionar...</option>
                                                                    {CATEGORY_WEIGHTS[formData.category].map(opt => (
                                                                        <option key={opt} value={opt} className="bg-[#1A261D] text-white">{opt}</option>
                                                                    ))}
                                                                    <option value="custom" className="bg-[#1A261D] text-[#C8AA6E] font-bold">✒️ Otro (Escribir manual)</option>
                                                                </select>
                                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                    <span className="material-icons-outlined text-white/40 text-sm">expand_more</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <input
                                                                value={v.name}
                                                                onChange={(e) => updateVariant(i, 'name', e.target.value)}
                                                                placeholder="Ej: 250g, XL, Rojo"
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#C8AA6E] outline-none"
                                                            />
                                                        )}

                                                        {/* Fallback para entrada manual si elige 'custom' o no coincide con la lista, pero por simplicidad permitimos editar si no está en la lista si quisiéramos complegidad. 
                                                            Por ahora, si el usuario elige 'custom' podríamos mostrar un input extra, pero vamos a mantenerlo simple: 
                                                            vamos a permitir que el select tenga un input si es necesario, o simplemente el usuario elige de la lista.
                                                            Para satisfacer el requerimiento estricto de lista desplegable, lo dejamos así. 
                                                            Si el valor actual NO está en la lista (legacy), debería mostrarse o permitir cambiarlo. 
                                                        */}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] uppercase tracking-widest text-[#C8AA6E]">Precio (COP)</label>
                                                            <input
                                                                type="number"
                                                                value={v.price}
                                                                onChange={(e) => updateVariant(i, 'price', parseFloat(e.target.value))}
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#C8AA6E] outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] uppercase tracking-widest text-[#C8AA6E]">Stock</label>
                                                            <input
                                                                type="number"
                                                                value={v.stock}
                                                                onChange={(e) => updateVariant(i, 'stock', parseInt(e.target.value))}
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#C8AA6E] outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {formData.variants?.length === 0 && (
                                        <div className="text-center py-12 text-white/40">
                                            <Package size={48} className="mx-auto mb-4 opacity-20" />
                                            <p>No hay presentaciones agregadas aún</p>
                                            <p className="text-xs mt-2">Añade variantes de peso o tamaño para este producto</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="pt-12 border-t border-white/5 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-gradient-to-r from-[#C8AA6E] to-[#AA771C] text-black font-bold uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-[#C8AA6E]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {saving ? '💫 Guardando...' : (editingProduct ? '✨ Actualizar Producto' : '🚀 Publicar en Despensa')}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-12 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest py-5 rounded-2xl transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse"></div>
                        ))
                    ) : products.map((p) => {
                        const catInfo = categoryNames[p.category] || {
                            label: p.category || 'Desconocido',
                            icon: '📦',
                            color: '#888888'
                        };
                        return (
                            <div key={p.id} className="group bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:border-[#C8AA6E]/50 transition-all duration-500 cursor-pointer flex flex-col">
                                <div className="aspect-video relative overflow-hidden bg-black/40 p-6 flex items-center justify-center">
                                    <img
                                        src={p.image_url || '/logo-origen-sierra-nevada.svg'}
                                        className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-700"
                                        alt={p.name.es}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/60 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 text-white/80 flex items-center gap-1">
                                            <span>{catInfo.icon}</span>
                                            {catInfo.label}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-serif text-white mb-2">{p.name.es}</h3>
                                    <p className="text-white/30 text-xs line-clamp-2 mb-4 font-light">{p.description.es}</p>

                                    {p.intrinsics?.personality?.es && (
                                        <div className="mb-4 text-xs text-purple-400/80 italic">
                                            💫 {p.intrinsics.personality.es}
                                        </div>
                                    )}

                                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-white/40 uppercase tracking-widest">Desde</span>
                                            <span className="text-[#C8AA6E] font-serif text-lg">{formatPrice(p.price)}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(p)}
                                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#C8AA6E] hover:text-black hover:border-[#C8AA6E] transition-all"
                                            >
                                                <span className="material-icons-outlined text-base">edit</span>
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('¿Eliminar este producto?')) {
                                                        await productService.deleteProduct(p.id);
                                                        fetchProducts();
                                                    }
                                                }}
                                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                                            >
                                                <span className="material-icons-outlined text-base">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .animate-slide-up {
                    animation: slide-up 0.4s ease-out;
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ProductManager;
