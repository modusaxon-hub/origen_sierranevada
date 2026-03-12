import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '@/services/productService';
import { supabase } from '@/services/supabaseClient';
import { Product, ProductVariant } from '@/shared/types';
import { useLanguage } from '../contexts/LanguageContext';
import { Package, Palette, Sparkles, Heart, Zap, Wand2, X, RotateCcw, Box } from 'lucide-react';
import AdminHeader from '@/shared/components/AdminHeader';
import SystemFeedback from '@/shared/components/SystemFeedback';
import ImageAIAssistant from '@/shared/components/ImageAIAssistant';
import { authService } from '@/services/authService';

// Constantes de configuración
const CATEGORY_WEIGHTS: Record<string, string[]> = {
    cafetal: ['250g', '500g', '1000g', '2500g', '5lb'],
    accesorios: ['Pequeño', 'Mediano', 'Grande', 'Único', 'Set x 2'],
    antojitos: ['50g', '100g', '250g', '500g', 'Único']
};

const GRIND_OPTIONS = [
    'En Grano',
    'Molido',
    'Molido Fina',
    'Molido Media',
    'Molido Gruesa'
];

const EMPTY_SUPPLIER = {
    nombre: '', nit: '', contacto: '', telefono: '', email: '',
    costo_unitario: 0, condiciones_pago: '', referencia_interna: '', notas_proveedor: ''
};

const ProductManager: React.FC = () => {
    const { formatPrice } = useLanguage();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [activeLangTab, setActiveLangTab] = useState<'es' | 'en'>('es');
    const [saving, setSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeSection, setActiveSection] = useState<'basic' | 'personality' | 'variants'>('basic');
    const [showAIAssistant, setShowAIAssistant] = useState(false);
    const [pendingUsersCount, setPendingUsersCount] = useState(0);
    const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'cafetal' | 'accesorios' | 'antojitos'>('all');

    // Form state con todos los campos
    const [formData, setFormData] = useState<Partial<Product>>({
        category: 'cafetal',
        name: { es: '', en: '' },
        description: { es: '', en: '' },
        story: { es: '', en: '' },
        traceability: { es: '', en: '' },
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
        try {
            const { data, error } = selectedCategory === 'all'
                ? await productService.getAllProducts(100)
                : await productService.getProductsByCategory(selectedCategory);

            if (error) {
                console.error("Error fetching products:", error);
                setFeedback({ msg: "Error al cargar productos: " + error.message, type: 'error' });
            } else {
                setProducts(data || []);
            }
        } catch (err: any) {
            console.error("Fetch Crash:", err);
            setFeedback({ msg: "Error crítico al cargar: " + err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchCounts = async () => {
        try {
            const { data: profiles } = await authService.getAllProfiles();
            if (profiles) {
                setPendingUsersCount((profiles as any[]).filter(p => p.status === 'pending').length);
            }
            const { count } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .in('status', ['pending', 'pending_payment']);
            setPendingOrdersCount(count || 0);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCounts();
    }, [selectedCategory]);

    const resetForm = () => {
        setFormData({
            category: 'cafetal',
            name: { es: '', en: '' },
            description: { es: '', en: '' },
            story: { es: '', en: '' },
            traceability: { es: '', en: '' },
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

        if (isUploading) {
            setFeedback({ msg: "Espera a que la imagen termine de subirse...", type: 'error' });
            return;
        }

        setSaving(true);
        setFeedback({ msg: null, type: 'info' });

        try {
            // Inteligencia de Sincronización Automática
            let totalStock = 0;
            let basePrice = formData.price || 0;
            let hasValidVariant = false;

            if (formData.variants && formData.variants.length > 0) {
                // Calcular stock total de las variantes
                totalStock = formData.variants.reduce((acc, v) => acc + (v.stock || 0), 0);

                // Sincronizar precio base con la variante más económica que tenga stock
                const variantsWithStock = formData.variants.filter(v => (v.stock || 0) > 0);
                if (variantsWithStock.length > 0) {
                    basePrice = Math.min(...variantsWithStock.map(v => v.price));
                    hasValidVariant = true;
                } else if (formData.variants.length > 0) {
                    // Si ninguna tiene stock, aún tomamos el precio de la más económica para catálogo
                    basePrice = Math.min(...formData.variants.map(v => v.price));
                }
            } else {
                totalStock = formData.stock || 0;
                if (totalStock > 0) hasValidVariant = true;
            }

            const dataToSave = {
                ...formData,
                price: basePrice,
                stock: totalStock,
                available: hasValidVariant && !!formData.image_url
            };

            let result;
            if (editingProduct) {
                // Si es un producto de prueba (ID empieza con fallback-), forzamos creación de uno nuevo
                if (editingProduct.id.startsWith('fallback-')) {
                    const { id: _id, ...newProductData } = dataToSave;
                    result = await productService.createProduct(newProductData as any);
                    if (!result.error) setFeedback({ msg: "¡Producto de prueba convertido a producto real!", type: 'success' });
                } else {
                    result = await productService.updateProduct(editingProduct.id, dataToSave);
                }
            } else {
                result = await productService.createProduct(dataToSave as any);
            }

            if (result.error) {
                console.error("Supabase Error Full:", result.error);
                const errorMsg = (result.error as any).message || "Error desconocido";
                setFeedback({ msg: `Error al guardar: ${errorMsg}`, type: 'error' });
                return;
            }

            // Success
            setFeedback({ msg: "¡Cambios guardados con éxito!", type: 'success' });

            // Refrescar y cerrar después de un breve delay
            setTimeout(() => {
                resetForm();
                fetchProducts();
                setShowForm(false);
            }, 1000);

        } catch (err: any) {
            console.error("Save Crash:", err);
            setFeedback({ msg: `Error crítico: ${err.message}`, type: 'error' });
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
        <div className="min-h-screen bg-[#050806] text-white selection:bg-[#C8AA6E] selection:text-black font-sans">
            <AdminHeader
                title="DESPENSA CENTRAL"
                pendingOrdersCount={pendingOrdersCount}
                pendingUsersCount={pendingUsersCount}
            />

            <SystemFeedback
                message={feedback.msg}
                type={feedback.type}
                onClose={() => setFeedback({ ...feedback, msg: null })}
            />
            <div className="max-w-7xl mx-auto pt-32 pb-20 px-6">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/admin')}
                            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#C8AA6E] hover:text-black transition-all group"
                        >
                            <span className="material-icons-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        </button>
                        <div className="space-y-2">
                            <div className="inline-block px-3 py-1 bg-[#C8AA6E]/10 border border-[#C8AA6E]/30 rounded-full">
                                <span className="text-[10px] text-[#C8AA6E] font-bold uppercase tracking-[0.2em]">Despensa Central</span>
                            </div>
                            <h1 className="text-4xl font-serif text-white tracking-tight">Maestro de Productos</h1>
                            <p className="text-white/40 text-sm">Gestiona el alma de cada producto desde aquí</p>
                        </div>
                    </div>

                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-[#C8AA6E] text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-[#D4B075] hover:shadow-[0_0_20px_rgba(200,170,110,0.3)] transition-all flex items-center gap-2"
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

                            {/* Category Selection - PROMINENTE */}
                            <div className="bg-gradient-to-br from-[#C8AA6E]/10 to-transparent border border-[#C8AA6E]/30 rounded-2xl p-6 mb-8">
                                <label className="text-sm text-[#C8AA6E] uppercase tracking-widest font-bold mb-4 block">
                                    Selecciona la Despensa
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                                    Historia del Café ({activeLangTab.toUpperCase()})
                                                    {formData.category !== 'cafetal' && <span className="text-white/30 normal-case ml-2">(solo para Cafetal)</span>}
                                                </label>
                                                <textarea
                                                    rows={4}
                                                    value={formData.story?.[activeLangTab] || ''}
                                                    onChange={(e) => setFormData(prev => ({
                                                        ...prev,
                                                        story: { ...prev.story!, [activeLangTab]: e.target.value }
                                                    }))}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none resize-none"
                                                    placeholder="Cuenta la historia única de este café..."
                                                />
                                            </div>

                                            {/* Trazabilidad — solo para Cafetal */}
                                            {formData.category === 'cafetal' && (
                                                <div className="space-y-2 border border-[#C8AA6E]/20 bg-[#C8AA6E]/5 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="material-icons-outlined text-[#C8AA6E] text-sm">travel_explore</span>
                                                        <label className="text-[10px] text-[#C8AA6E] uppercase tracking-widest font-bold">
                                                            Trazabilidad ({activeLangTab.toUpperCase()})
                                                        </label>
                                                    </div>
                                                    <p className="text-white/30 text-[10px] mb-2">Describe la finca, altitud, proceso y perfil de taza. Esta información aparecerá en la sección de Trazabilidad del Home cuando este café esté activo en el visor.</p>
                                                    <textarea
                                                        rows={5}
                                                        value={(formData as any).traceability?.[activeLangTab] || ''}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            traceability: { ...(prev as any).traceability, [activeLangTab]: e.target.value }
                                                        }))}
                                                        className="w-full bg-black/40 border border-[#C8AA6E]/20 rounded-xl px-4 py-3 focus:border-[#C8AA6E] outline-none resize-none text-sm"
                                                        placeholder="Ej: Finca La Jagua · San Pedro de la Sierra · 2.200 msnm · Proceso Honey · Notas: Mora, Maracuyá, Panela..."
                                                    />
                                                </div>
                                            )}
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

                                                                setIsUploading(true);
                                                                try {
                                                                    const { data, error } = await productService.uploadImage(file);
                                                                    if (data) {
                                                                        setFormData(prev => ({ ...prev, image_url: data }));
                                                                    } else if (error) {
                                                                        setFeedback({ msg: 'Error al subir imagen: ' + error.message, type: 'error' });
                                                                    }
                                                                } catch (err) {
                                                                    setFeedback({ msg: 'Error en la conexión al subir imagen', type: 'error' });
                                                                } finally {
                                                                    setIsUploading(false);
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

                                                    {formData.image_url && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowAIAssistant(true)}
                                                            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#C8AA6E]/10 border border-[#C8AA6E]/30 text-[#C8AA6E] hover:bg-[#C8AA6E]/20 transition-all group"
                                                        >
                                                            <Wand2 size={14} className="group-hover:rotate-12 transition-transform" />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">Optimizar con Asistente IA</span>
                                                        </button>
                                                    )}
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

                                            <div className="grid grid-cols-1 gap-4">
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

                                    {/* ── SUPPLIER / PROVEEDOR (interno) ── */}
                                    <div className="border border-amber-600/20 bg-amber-950/10 rounded-2xl overflow-hidden">
                                        {/* Header */}
                                        <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-600/10">
                                            <span className="material-icons-outlined text-amber-400/70 text-lg">storefront</span>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-bold text-amber-400/90 uppercase tracking-widest">Datos del Proveedor</h3>
                                                <p className="text-amber-400/40 text-[10px] mt-0.5">Uso interno · No visible para el cliente · Se cruza con dashboard de proveedor y reportes de ventas</p>
                                            </div>
                                            <span className="px-2 py-0.5 bg-amber-600/10 border border-amber-600/20 rounded-full text-[9px] font-bold text-amber-400/70 uppercase tracking-widest">Admin Only</span>
                                        </div>

                                        {/* Fields */}
                                        <div className="p-6 space-y-5">
                                            {/* Fila 1: Nombre + NIT */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] text-amber-400/70 uppercase tracking-widest font-bold">Razón Social / Nombre</label>
                                                    <input
                                                        value={formData.supplier?.nombre || ''}
                                                        onChange={e => setFormData(prev => ({ ...prev, supplier: { ...EMPTY_SUPPLIER, ...prev.supplier, nombre: e.target.value } }))}
                                                        className="w-full bg-black/30 border border-amber-600/15 rounded-xl px-4 py-3 text-white/80 focus:border-amber-500/50 focus:outline-none transition-all text-sm"
                                                        placeholder="Ej: Cafés Arhuaco SAS"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] text-amber-400/70 uppercase tracking-widest font-bold">NIT / Identificación Fiscal</label>
                                                    <input
                                                        value={formData.supplier?.nit || ''}
                                                        onChange={e => setFormData(prev => ({ ...prev, supplier: { ...EMPTY_SUPPLIER, ...prev.supplier, nit: e.target.value } }))}
                                                        className="w-full bg-black/30 border border-amber-600/15 rounded-xl px-4 py-3 text-white/80 focus:border-amber-500/50 focus:outline-none transition-all text-sm font-mono"
                                                        placeholder="900.123.456-7"
                                                    />
                                                </div>
                                            </div>

                                            {/* Fila 2: Contacto + Teléfono + Email */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] text-amber-400/70 uppercase tracking-widest font-bold">Contacto Principal</label>
                                                    <input
                                                        value={formData.supplier?.contacto || ''}
                                                        onChange={e => setFormData(prev => ({ ...prev, supplier: { ...EMPTY_SUPPLIER, ...prev.supplier, contacto: e.target.value } }))}
                                                        className="w-full bg-black/30 border border-amber-600/15 rounded-xl px-4 py-3 text-white/80 focus:border-amber-500/50 focus:outline-none transition-all text-sm"
                                                        placeholder="Nombre del responsable"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] text-amber-400/70 uppercase tracking-widest font-bold">Teléfono / WhatsApp</label>
                                                    <input
                                                        value={formData.supplier?.telefono || ''}
                                                        onChange={e => setFormData(prev => ({ ...prev, supplier: { ...EMPTY_SUPPLIER, ...prev.supplier, telefono: e.target.value } }))}
                                                        className="w-full bg-black/30 border border-amber-600/15 rounded-xl px-4 py-3 text-white/80 focus:border-amber-500/50 focus:outline-none transition-all text-sm font-mono"
                                                        placeholder="+57 300 000 0000"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] text-amber-400/70 uppercase tracking-widest font-bold">Email de Facturación</label>
                                                    <input
                                                        type="email"
                                                        value={formData.supplier?.email || ''}
                                                        onChange={e => setFormData(prev => ({ ...prev, supplier: { ...EMPTY_SUPPLIER, ...prev.supplier, email: e.target.value } }))}
                                                        className="w-full bg-black/30 border border-amber-600/15 rounded-xl px-4 py-3 text-white/80 focus:border-amber-500/50 focus:outline-none transition-all text-sm"
                                                        placeholder="facturacion@proveedor.com"
                                                    />
                                                </div>
                                            </div>

                                            {/* Fila 3: Costo + Condiciones + Ref interna */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] text-amber-400/70 uppercase tracking-widest font-bold">Costo Unitario (COP)</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/40 text-sm font-mono">$</span>
                                                        <input
                                                            type="number"
                                                            value={formData.supplier?.costo_unitario || ''}
                                                            onChange={e => setFormData(prev => ({ ...prev, supplier: { ...EMPTY_SUPPLIER, ...prev.supplier, costo_unitario: parseFloat(e.target.value) || 0 } }))}
                                                            className="w-full bg-black/30 border border-amber-600/15 rounded-xl pl-8 pr-4 py-3 text-white/80 focus:border-amber-500/50 focus:outline-none transition-all text-sm font-mono"
                                                            placeholder="25000"
                                                        />
                                                    </div>
                                                    {formData.supplier?.costo_unitario && formData.price ? (
                                                        <p className="text-[10px] text-amber-400/50">
                                                            Margen: {(((formData.price - formData.supplier.costo_unitario) / formData.price) * 100).toFixed(1)}%
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] text-amber-400/70 uppercase tracking-widest font-bold">Condiciones de Pago</label>
                                                    <select
                                                        value={formData.supplier?.condiciones_pago || ''}
                                                        onChange={e => setFormData(prev => ({ ...prev, supplier: { ...EMPTY_SUPPLIER, ...prev.supplier, condiciones_pago: e.target.value } }))}
                                                        className="w-full bg-[#1A1200] border border-amber-600/15 rounded-xl px-4 py-3 text-white/80 focus:border-amber-500/50 focus:outline-none transition-all text-sm"
                                                    >
                                                        <option value="" className="bg-[#1A1200]">— Seleccionar —</option>
                                                        {['Contra entrega', '30 días', '60 días', '50% anticipo', 'Mensual', 'Crédito rotativo', 'Otro'].map(o => (
                                                            <option key={o} value={o} className="bg-[#1A1200]">{o}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] text-amber-400/70 uppercase tracking-widest font-bold">Referencia Interna / SKU</label>
                                                    <input
                                                        value={formData.supplier?.referencia_interna || ''}
                                                        onChange={e => setFormData(prev => ({ ...prev, supplier: { ...EMPTY_SUPPLIER, ...prev.supplier, referencia_interna: e.target.value } }))}
                                                        className="w-full bg-black/30 border border-amber-600/15 rounded-xl px-4 py-3 text-white/80 focus:border-amber-500/50 focus:outline-none transition-all text-sm font-mono"
                                                        placeholder="SKU-0024-A"
                                                    />
                                                </div>
                                            </div>

                                            {/* Notas */}
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] text-amber-400/70 uppercase tracking-widest font-bold">Notas de Negociación / Logística</label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.supplier?.notas_proveedor || ''}
                                                    onChange={e => setFormData(prev => ({ ...prev, supplier: { ...EMPTY_SUPPLIER, ...prev.supplier, notas_proveedor: e.target.value } }))}
                                                    className="w-full bg-black/30 border border-amber-600/15 rounded-xl px-4 py-3 text-white/80 focus:border-amber-500/50 focus:outline-none resize-none transition-all text-sm"
                                                    placeholder="Condiciones especiales, tiempos de entrega, acuerdos de exclusividad..."
                                                />
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

                            {/* Opciones de Molienda eliminadas: se gestionan por presentación (variante) directamente */}

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
                                                                {(!CATEGORY_WEIGHTS[formData.category].includes(v.name) && v.name !== 'custom' && v.name !== '') || v.name === 'custom' ? (
                                                                    <div className="flex gap-2">
                                                                        <div className="relative flex-1">
                                                                            <input
                                                                                autoFocus
                                                                                value={v.name === 'custom' ? '' : v.name}
                                                                                onChange={(e) => updateVariant(i, 'name', e.target.value)}
                                                                                placeholder="Ej: 125 gr, 1 Litro..."
                                                                                className="w-full bg-white/5 border border-[#C8AA6E] rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#C8AA6E] outline-none text-white shadow-[0_0_15px_rgba(200,170,110,0.1)]"
                                                                            />
                                                                            {v.name === 'custom' && (
                                                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                                                    <span className="text-[8px] text-[#C8AA6E] animate-pulse">ESCRIBE...</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => updateVariant(i, 'name', '')}
                                                                            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all"
                                                                            title="Volver a la lista"
                                                                        >
                                                                            <RotateCcw size={14} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
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
                                                                )}
                                                                {!((!CATEGORY_WEIGHTS[formData.category].includes(v.name) && v.name !== 'custom' && v.name !== '') || v.name === 'custom') && (
                                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                        <span className="material-icons-outlined text-white/40 text-sm">expand_more</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <input
                                                                value={v.name}
                                                                onChange={(e) => updateVariant(i, 'name', e.target.value)}
                                                                placeholder="Ej: 250g, XL, Rojo"
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#C8AA6E] outline-none"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] uppercase tracking-widest text-[#C8AA6E]">Precio (COP)</label>
                                                            <input
                                                                type="number"
                                                                value={v.price}
                                                                onChange={(e) => updateVariant(i, 'price', parseFloat(e.target.value))}
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#C8AA6E] outline-none"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] uppercase tracking-widest text-[#C8AA6E]">Stock</label>
                                                            <input
                                                                type="number"
                                                                value={v.stock}
                                                                onChange={(e) => updateVariant(i, 'stock', parseInt(e.target.value))}
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#C8AA6E] outline-none"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Inteligencia por Categoría */}
                                                    {formData.category === 'cafetal' && (
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] uppercase tracking-widest text-[#C8AA6E]">Molienda Específica</label>
                                                            <select
                                                                value={v.grind || ''}
                                                                onChange={(e) => updateVariant(i, 'grind', e.target.value)}
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#C8AA6E] outline-none text-white/70"
                                                            >
                                                                <option value="">Cualquier molienda</option>
                                                                {GRIND_OPTIONS.map(opt => (
                                                                    <option key={opt} value={opt} className="bg-[#1A261D]">{opt}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {formData.category === 'antojitos' && (
                                                        <div className="grid grid-cols-2 gap-4 pt-1">
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] uppercase tracking-widest text-[#6EC8BD]">Unds x Pack</label>
                                                                <input
                                                                    type="number"
                                                                    value={v.units_per_package || ''}
                                                                    onChange={(e) => updateVariant(i, 'units_per_package', parseInt(e.target.value))}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6EC8BD] outline-none"
                                                                    placeholder="Ej: 12"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] uppercase tracking-widest text-[#6EC8BD]">Peso Und (g)</label>
                                                                <input
                                                                    type="number"
                                                                    value={v.weight_per_unit || ''}
                                                                    onChange={(e) => updateVariant(i, 'weight_per_unit', parseInt(e.target.value))}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#6EC8BD] outline-none"
                                                                    placeholder="Ej: 5"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
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
                                    disabled={saving || isUploading}
                                    className="flex-1 bg-gradient-to-r from-[#C8AA6E] to-[#AA771C] text-black font-bold uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-[#C8AA6E]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isUploading ? '📤 Subiendo Foto...' : (saving ? '💫 Guardando...' : (editingProduct ? '✨ Actualizar Producto' : '🚀 Publicar en Despensa'))}
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

                {/* Category Filter */}
                {!showForm && (
                    <div className="mb-12 flex gap-4 justify-center">
                        {Object.entries(categoryNames).map(([key, { label, icon, color }]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedCategory(key as any)}
                                style={{
                                    backgroundColor: selectedCategory === key ? color : 'transparent',
                                    borderColor: selectedCategory === key ? color : 'rgba(255,255,255,0.1)'
                                }}
                                className={`px-6 py-3 rounded-lg font-bold uppercase text-xs tracking-widest transition-all border-2 ${selectedCategory === key
                                    ? 'text-black shadow-lg shadow-white/5'
                                    : 'bg-white/5 text-white/60 hover:text-white'
                                    }`}
                            >
                                <span className="mr-2">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Products List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse"></div>
                        ))
                    ) : products.length > 0 ? (
                        products.map((p) => {
                            const catInfo = categoryNames[p.category as keyof typeof categoryNames] || {
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
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                            <Box className="w-12 h-12 text-white/10 mx-auto mb-4" />
                            <h3 className="text-xl font-serif text-white/40">No hay productos en esta despensa</h3>
                            <p className="text-white/20 text-sm mt-2">Prueba cambiando el filtro o agrega un nuevo producto</p>
                        </div>
                    )}
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
            {/* Image AI Assistant Modal */}
            <ImageAIAssistant
                isOpen={showAIAssistant}
                onClose={() => setShowAIAssistant(false)}
                imageUrl={formData.image_url || ''}
                onApply={(newUrl) => {
                    setFormData(prev => ({ ...prev, image_url: newUrl }));
                    setShowAIAssistant(false);
                    setFeedback({ msg: "Imagen optimizada aplicada", type: 'success' });
                }}
            />
        </div>
    );
};

export default ProductManager;
