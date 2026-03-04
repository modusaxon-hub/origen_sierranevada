import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/shared/components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { productService } from '@/services/productService';
import { Product } from '@/shared/types';
import SEO from '@/shared/components/SEO';
import ProductDetailsModal from '@/shared/components/ProductDetailsModal';
import { AccessoryCard } from '@/shared/components/AccessoryCard';
import { AntojitoCard } from '@/shared/components/AntojitoCard';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { language, formatPrice } = useLanguage();
    const { addToCart } = useCart();
    const lang = (language as 'es' | 'en') || 'es';

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Viewer State (Now in Hero)
    const [activeViewerCat, setActiveViewerCat] = useState<'coffee' | 'accessories' | 'antojitos'>('coffee');
    const [viewerIdx, setViewerIdx] = useState(0);

    // Swipe Gestures Logic
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;


    // Detail Modal State
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Selección de variante y molienda - Ahora dinámico según producto
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const [selectedGrind, setSelectedGrind] = useState('En Grano');

    // Specific state for modal product (to avoid conflict with viewerIdx)
    const [selectedModalProduct, setSelectedModalProduct] = useState<Product | null>(null);

    const FALLBACK_PRODUCTS: Product[] = [
        {
            id: 'fallback-coffee-1',
            category: 'cafetal',
            name: { es: 'Café Malú Reserva Especial', en: 'Malu Coffee Special Reserve' },
            price: 35000,
            image_url: '/cafe_malu_full_composition.png',
            stock: 100,
            description: { es: 'Notas a chocolate y frutos rojos.', en: 'Notes of chocolate and red fruits.' },
            story: { es: 'Trazabilidad desde las montañas...', en: 'Traceability from the mountains...' },
            tags: { es: ['Chocolate'], en: ['Chocolate'] },
            color: '#C5A065',
            mask_type: 'pop',
            variants: [{ id: 'v1', name: '500g', price: 35000, stock: 100 }],
            weight: 500,
            origin: 'Sierra Nevada',
            available: true,
            intrinsics: {
                grind_options: ['En Grano', 'Molido'],
                character: { es: 'Elegante', en: 'Elegant' }
            }
        }
    ];

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const minWait = new Promise(resolve => setTimeout(resolve, 800));
                const { data, error } = await productService.getAllProducts();
                await minWait;

                if (!error && data && data.length > 0) {
                    setAllProducts(data);
                } else {
                    console.warn('Supabase returned empty or error, using fallbacks');
                    setAllProducts(FALLBACK_PRODUCTS);
                }
            } catch (err) {
                console.error('Fetch Crash, using fallbacks:', err);
                setAllProducts(FALLBACK_PRODUCTS);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);



    const viewerProducts = allProducts.filter(p => {
        if (activeViewerCat === 'coffee') return p.category === 'cafetal' || p.category === 'coffee';
        if (activeViewerCat === 'accessories') return p.category === 'accesorios' || p.category === 'accessories';
        if (activeViewerCat === 'antojitos') return p.category === 'antojitos';
        return p.category === activeViewerCat;
    });
    const currentProduct = viewerProducts[viewerIdx];

    const nextProduct = () => setViewerIdx(prev => (prev + 1) % viewerProducts.length);
    const prevProduct = () => setViewerIdx(prev => (prev - 1 + viewerProducts.length) % viewerProducts.length);

    useEffect(() => {
        setViewerIdx(0);
        setSelectedVariantId(null); // Reset variante al cambiar categoría
    }, [activeViewerCat]);

    // Resetear variante seleccionada cuando cambia el producto
    useEffect(() => {
        if (currentProduct?.variants && currentProduct.variants.length > 0) {
            // Filtrar variantes con stock > 0
            const availableVariants = currentProduct.variants.filter(v => v.stock > 0);
            if (availableVariants.length > 0) {
                setSelectedVariantId(availableVariants[0].id);
            } else {
                setSelectedVariantId(null);
            }
        } else {
            setSelectedVariantId(null);
        }
        // Resetear molienda al primer valor disponible
        const grindOptions = currentProduct?.intrinsics?.grind_options;
        if (grindOptions && grindOptions.length > 0) {
            setSelectedGrind(grindOptions[0]);
        } else {
            setSelectedGrind('En Grano');
        }
    }, [currentProduct?.id]);

    // Obtener variante seleccionada y precio actual
    const selectedVariant = currentProduct?.variants?.find(v => v.id === selectedVariantId);
    const currentPrice = selectedVariant?.price ?? currentProduct?.price ?? 0;
    // Aplicar descuento solo en Cafetal para usuarios registrados
    const isCafetal = currentProduct?.category === 'cafetal' || currentProduct?.category === 'coffee';
    const finalPrice = (user && isCafetal) ? currentPrice * 0.9 : currentPrice;

    // Obtener variantes disponibles (con stock)
    const availableVariants = currentProduct?.variants?.filter(v => v.stock > 0) ?? [];
    // Obtener opciones de molienda del producto
    const grindOptions = currentProduct?.intrinsics?.grind_options ?? ['En Grano', 'Molido'];

    // Touch Swipe Handlers (Only for Single View mainly)
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) nextProduct();
        if (isRightSwipe) prevProduct();
    };


    const handleAddToCart = () => {
        if (!currentProduct) return;

        // Construir nombre con variante y molienda
        const variantName = selectedVariant?.name ?? '';
        const productName = currentProduct.name[lang] || currentProduct.name.es;
        const displayName = variantName ? `${productName} (${variantName})` : productName;

        addToCart({
            id: `${currentProduct.id}-${selectedVariantId || 'base'}-${selectedGrind}`,
            name: displayName,
            sub: isCafetal ? `${selectedGrind} • ${currentProduct.badge?.[lang] || 'Premium'}` : (currentProduct.badge?.[lang] || 'Premium'),
            price: finalPrice,
            qty: 1,
            img: currentProduct.image_url || '/cafe_malu_full_composition.png'
        });
    };

    return (
        <div className="min-h-screen bg-[#050806] text-white">
            <header className="relative min-h-[100vh] w-full overflow-hidden flex flex-col items-center justify-center pt-48 md:pt-48 lg:pt-36 xl:pt-40 [@media(orientation:landscape)_and_(max-height:800px)]:pt-32">

                {/* 1. ATMOSPHERIC BACKGROUND LAYERS */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img alt="Sierra Nevada Texture" className="w-full h-full object-cover opacity-20 filter blur-sm grayscale contrast-125 mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcfAtXK3rO0DtljnnG98PWskBu0QIToFPcvB-G_wdSE1gPPoRefQj9wBEQwIF1hyVZEJIeb9EX1GyHYkuUrgDl3yDsLWABFaFGrYkdWG0MuXBAnm-uy7guEIXcwo1KUzQBE78bHQOH32lkwEQYosLe-sT-OvYBvUKE9XCyVSRjb-jsEVJAc4qcVT6dcVDtct1NHtwEezMsCd_rOzArG4Nd6VvlZ6HsfdzvFmMQ728789xZkrYQn6BZWo_kNRNpp5E6D5h2tQv6Lqep" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050806]/0 via-[#050806]/80 to-[#050806]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center">

                    {/* MASTER SELECTOR - Order 1 */}
                    <div className="flex flex-col items-center text-center space-y-4 mb-4 lg:mb-8 mt-2 order-1">
                        <div className="space-y-1">
                            <h2 className="text-[#C8AA6E] text-[8px] md:text-xs font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] block animate-fade-in drop-shadow-sm px-4">
                                Nuestra Despensa Exibidora de {
                                    activeViewerCat === 'coffee' ? 'Café' :
                                        activeViewerCat === 'accessories' ? 'Accesorios' : 'Antojitos'
                                }
                            </h2>
                            <div className="h-[1px] w-24 md:w-32 bg-gradient-to-r from-transparent via-[#C8AA6E]/60 to-transparent mx-auto"></div>
                        </div>

                        {/* Category Selector Tabs */}
                        <div className="flex bg-white/[0.02] border border-white/10 p-1 md:p-1.5 rounded-full backdrop-blur-xl scale-[0.85] sm:scale-95 md:scale-110 animate-slide-up shadow-2xl overflow-hidden">
                            {[
                                { id: 'coffee', label: 'CAFETAL', icon: 'local_cafe' },
                                { id: 'accessories', label: 'ACCESORIOS', icon: 'spa' },
                                { id: 'antojitos', label: 'ANTOJITOS', icon: 'settings_input_component' }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveViewerCat(cat.id as any)}
                                    className={`flex items-center gap-1.5 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.25em] transition-all duration-500 ${activeViewerCat === cat.id ? 'bg-[#C8AA6E] text-black shadow-[0_0_20px_rgba(197,160,101,0.3)]' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                                >
                                    <span className="material-icons-outlined text-xs md:text-base">{cat.icon}</span>
                                    <span className="whitespace-nowrap">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MOBILE ONLY TITLE/BADGE for COFFEE */}
                    {currentProduct && !loading && activeViewerCat === 'coffee' && (
                        <div className="flex flex-col items-center text-center space-y-3 mb-6 order-2 lg:hidden animate-fade-in-up">
                            <span className="text-[#C8AA6E] text-[8px] font-bold tracking-[0.5em] uppercase px-3 py-1.5 border border-[#C8AA6E]/30 bg-black/40 backdrop-blur-md rounded-sm">
                                {currentProduct.badge?.[lang] || (currentProduct.score ? `SCA Score: ${currentProduct.score}` : 'Edición de Colección')}
                            </span>
                            {currentProduct.name['es']?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes('malu') ? (
                                <img src="/logocafemalu-himalaya.png" alt={currentProduct.name[lang]} className="w-full max-w-[220px] h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" />
                            ) : (
                                <h1 className="text-3xl font-serif text-white italic drop-shadow-lg leading-tight uppercase tracking-tighter">
                                    {currentProduct.name[lang]}
                                </h1>
                            )}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-6 order-3">
                            <div className="w-16 h-16 border-2 border-[#C8AA6E]/10 border-t-[#C8AA6E] rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {/* =========================================
                               VIEW 1: ACCESSORIES CAROUSEL 
                               ========================================= */}
                            {activeViewerCat === 'accessories' && (
                                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-0 order-3 py-8 relative group/carousel">
                                    <div className="overflow-hidden w-full px-4 md:px-12">
                                        <div
                                            className="flex transition-transform duration-700 ease-out will-change-transform"
                                            style={{
                                                transform: `translateX(-${viewerIdx * (100 / (window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1))}%)`
                                            }}
                                        >
                                            {viewerProducts.map(product => (
                                                <div
                                                    key={product.id}
                                                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3 md:p-4"
                                                >
                                                    <AccessoryCard
                                                        product={product}
                                                        onClick={() => {
                                                            setSelectedModalProduct(product);
                                                            setIsDetailsOpen(true);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Carousel Arrows */}
                                    {viewerProducts.length > 3 && (
                                        <>
                                            <button
                                                onClick={prevProduct}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-[#C8AA6E] bg-black/50 backdrop-blur-sm rounded-full hover:bg-[#C8AA6E] hover:text-black transition-all border border-[#C8AA6E]/30"
                                            >
                                                <span className="material-icons-outlined">chevron_left</span>
                                            </button>
                                            <button
                                                onClick={nextProduct}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-[#C8AA6E] bg-black/50 backdrop-blur-sm rounded-full hover:bg-[#C8AA6E] hover:text-black transition-all border border-[#C8AA6E]/30"
                                            >
                                                <span className="material-icons-outlined">chevron_right</span>
                                            </button>
                                        </>
                                    )}
                                    {viewerProducts.length === 0 && (
                                        <div className="text-center text-white/40 py-20 italic">
                                            No hay accesorios disponibles.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* =========================================
                               VIEW 2: ANTOJITOS CAROUSEL (3 Per View)
                               ========================================= */}
                            {activeViewerCat === 'antojitos' && (
                                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-0 order-3 py-8 relative group/carousel">
                                    <div className="overflow-hidden w-full px-4 md:px-12">
                                        <div
                                            className="flex transition-transform duration-700 ease-out will-change-transform"
                                            style={{
                                                // 3 items per viewport breakpoint
                                                transform: `translateX(-${viewerIdx * (100 / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1))}%)`
                                            }}
                                        >
                                            {viewerProducts.map(product => (
                                                <div
                                                    key={product.id}
                                                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4 md:p-8"
                                                >
                                                    <AntojitoCard
                                                        product={product}
                                                        onClick={() => {
                                                            setSelectedModalProduct(product);
                                                            setIsDetailsOpen(true);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Navigation Arrows for Antojitos */}
                                    {viewerProducts.length > 3 && (
                                        <>
                                            <button
                                                onClick={prevProduct}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-[#C8AA6E] bg-black/50 backdrop-blur-sm rounded-full hover:bg-[#C8AA6E] hover:text-black transition-all border border-[#C8AA6E]/30"
                                            >
                                                <span className="material-icons-outlined">chevron_left</span>
                                            </button>
                                            <button
                                                onClick={nextProduct}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center text-[#C8AA6E] bg-black/50 backdrop-blur-sm rounded-full hover:bg-[#C8AA6E] hover:text-black transition-all border border-[#C8AA6E]/30"
                                            >
                                                <span className="material-icons-outlined">chevron_right</span>
                                            </button>
                                        </>
                                    )}
                                    {viewerProducts.length === 0 && (
                                        <div className="text-center text-white/40 py-20 italic">
                                            No hay antojitos disponibles.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* =========================================
                               VIEW 3: COFFEE SINGLE (HERO)
                               ========================================= */}
                            {activeViewerCat === 'coffee' && currentProduct && (
                                <div className="w-full max-w-[1800px] mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center relative lg:translate-x-[5%] order-3">

                                    {/* PRODUCT IMAGE - Order 1 in Grid */}
                                    <div
                                        className="w-full flex items-center justify-center relative animate-fade-in group py-4 lg:py-0 touch-pan-y"
                                        onTouchStart={onTouchStart}
                                        onTouchMove={onTouchMove}
                                        onTouchEnd={onTouchEnd}
                                    >
                                        <div className="relative w-[200px] h-[200px] md:w-[320px] md:h-[320px] lg:w-[280px] lg:h-[280px] xl:w-[420px] xl:h-[420px] 2xl:w-[560px] 2xl:h-[560px] shrink-0 mx-auto flex items-center justify-center animate-float-hero-pop" key={currentProduct.id}>
                                            {/* Aura Golden Flare */}
                                            <div className="absolute inset-x-[-20%] inset-y-[-20%] gold-flare pointer-events-none"></div>

                                            {/* Minimal Portal Mask Container */}
                                            <div className="absolute inset-[-10%] z-10 flex items-center justify-center pointer-events-none portal-mask-pop">
                                                <div className="w-full h-full flex items-center justify-center">
                                                    {/* Internal Ring - Two-Part Construction (Established Design) */}
                                                    <div className="absolute inset-[-10%] w-full h-full flex items-center justify-center pointer-events-none transition-all duration-1000 group-hover:scale-105">
                                                        {/* Upper Half - Defined Rim Light */}
                                                        <div className="absolute inset-0 rounded-full border-[1.5px] border-[#C5A065]/40 [mask-image:linear-gradient(to_bottom,black_48%,transparent_52%)]"></div>
                                                        {/* Lower Half - Subtle Backdrop */}
                                                        <div className="absolute inset-0 rounded-full border border-[#C5A065]/10 [mask-image:linear-gradient(to_top,black_48%,transparent_52%)]"></div>
                                                    </div>

                                                    {/* Central Glowing Ritual Orb */}
                                                    <div className="absolute inset-[25%] rounded-full bg-[#C5A065]/10 blur-3xl animate-pulse pointer-events-none"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PRODUCT INFO PANEL */}
                                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8 animate-fade-in-up lg:scale-[0.85] lg:origin-left">
                                        <div className="space-y-4 w-full">
                                            <div className="flex flex-col items-center lg:items-start gap-3 h-auto">

                                                {/* DESKTOP TITLE/BADGE */}
                                                <div className="hidden lg:flex flex-col items-start gap-4 animate-fade-in">
                                                    <span className="text-[#C8AA6E] text-[8px] font-bold tracking-[0.5em] uppercase px-3 py-1.5 border border-[#C8AA6E]/30 bg-black/40 backdrop-blur-md rounded-sm">
                                                        {currentProduct.badge?.[lang] || (currentProduct.score ? `SCA Score: ${currentProduct.score}` : 'Edición de Colección')}
                                                    </span>
                                                    {currentProduct.name['es']?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes('malu') ? (
                                                        <div className="relative w-full max-w-[400px] xl:max-w-[500px] h-auto my-2">
                                                            <img src="/logocafemalu-himalaya.svg" alt={currentProduct.name[lang]} className="w-full h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" />
                                                        </div>
                                                    ) : (
                                                        <h1 className="text-4xl lg:text-6xl xl:text-7xl font-serif text-white tracking-tighter leading-[0.8] italic drop-shadow-lg uppercase">
                                                            {currentProduct.name[lang]}
                                                        </h1>
                                                    )}
                                                </div>
                                            </div>

                                            {/* SENSORY PROFILE */}
                                            {currentProduct.tags?.[lang] && currentProduct.tags[lang].length > 0 && (
                                                <div className="py-4 border-y border-white/5 w-full flex flex-col gap-2">
                                                    <span className="text-[9px] text-[#C8AA6E]/60 uppercase tracking-[0.6em] font-bold block">Perfil Sensorial del Terroir</span>
                                                    <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2">
                                                        {currentProduct.tags[lang].map((tag, i) => (
                                                            <div key={i} className="flex flex-col group cursor-default">
                                                                <span className="text-[14px] md:text-[16px] font-serif text-[#C5A065] group-hover:text-[#EAE2B7] transition-colors italic tracking-widest">{tag}</span>
                                                                <span className="h-[1px] w-0 group-hover:w-full bg-[#C8AA6E] transition-all duration-700"></span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <p className="text-white/40 text-sm md:text-base leading-relaxed italic max-w-md font-light text-justify mx-auto lg:mx-0">
                                                "{currentProduct.description[lang]}"
                                                <button onClick={() => setIsDetailsOpen(true)} className="ml-2 text-[#C8AA6E] hover:text-white transition-colors decoration-[#C8AA6E]/30 underline underline-offset-4 text-[11px] font-bold uppercase tracking-widest inline-flex items-center gap-1 group">
                                                    {lang === 'es' ? 'Conoce más' : 'Read more'}
                                                    <span className="material-icons-outlined text-[14px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                                </button>
                                            </p>
                                        </div>

                                        {/* VARIATION SELECTORS */}
                                        <div className="w-full space-y-6">
                                            {/* Selector de Presentación/Gramaje - Dinámico */}
                                            {availableVariants.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between max-w-sm mx-auto lg:mx-0">
                                                        <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold">
                                                            {lang === 'es' ? 'Seleccionar Presentación' : 'Select Size'}
                                                        </span>
                                                        <span className="text-[10px] text-[#C8AA6E] font-bold tracking-widest">
                                                            {selectedVariant?.name || ''}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                                        {availableVariants.map(variant => (
                                                            <button
                                                                key={variant.id}
                                                                onClick={() => setSelectedVariantId(variant.id)}
                                                                className={`px-3 py-1.5 text-[11px] font-bold tracking-widest transition-all duration-500 rounded-sm border ${selectedVariantId === variant.id
                                                                    ? 'bg-[#C8AA6E] border-[#C8AA6E] text-black shadow-[0_0_10px_rgba(200,170,110,0.3)]'
                                                                    : 'border-white/10 text-white/40 hover:border-white/30'
                                                                    }`}
                                                            >
                                                                {variant.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Selector de Molienda - Solo para Café, Dinámico */}
                                            {isCafetal && grindOptions.length > 0 && (
                                                <div className="flex gap-12 max-w-lg mx-auto lg:mx-0">
                                                    <div className="space-y-2 flex-1">
                                                        <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold block">
                                                            {lang === 'es' ? 'Molienda' : 'Grind'}
                                                        </span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {grindOptions.map(grind => (
                                                                <button
                                                                    key={grind}
                                                                    onClick={() => setSelectedGrind(grind)}
                                                                    className={`flex-1 min-w-[80px] py-2 text-[11px] font-bold tracking-widest transition-all border rounded-sm ${selectedGrind === grind
                                                                        ? 'bg-white/10 border-[#C8AA6E] text-white'
                                                                        : 'border-white/5 text-white/20 hover:border-white/20'
                                                                        }`}
                                                                >
                                                                    {grind}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* CHECKOUT */}
                                        <div className="w-full space-y-6 pt-2">
                                            <div className="flex items-end justify-center lg:justify-start gap-6 h-10">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-[#C8AA6E] font-bold uppercase tracking-[0.3em] mb-0.5">
                                                        {lang === 'es' ? 'Inversión Actual' : 'Current Price'}
                                                    </span>
                                                    <span className="text-4xl font-serif text-white tracking-tighter">
                                                        {formatPrice(finalPrice)}
                                                    </span>
                                                    {user && isCafetal && (
                                                        <span className="text-[9px] text-green-400/70 uppercase tracking-widest mt-1">
                                                            {lang === 'es' ? '10% descuento aplicado' : '10% discount applied'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mx-auto lg:mx-0">
                                                <button
                                                    onClick={handleAddToCart}
                                                    disabled={availableVariants.length > 0 && !selectedVariantId}
                                                    className="px-12 py-5 rounded bg-[#C5A065] text-black text-sm font-bold uppercase tracking-widest hover:bg-[#D4B075] hover:shadow-[0_0_20px_rgba(197,160,101,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-shine-container btn-shine-effect"
                                                >
                                                    {lang === 'es' ? 'AÑADIR AL CARRITO' : 'ADD TO CART'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </>
                    )}

                    {/* PAGINATION DOTS (Only for Coffee View) */}
                    {viewerProducts.length > 1 && activeViewerCat === 'coffee' && (
                        <div className="z-50 flex items-center gap-4 lg:gap-6 animate-fade-in scale-90 lg:scale-100 mt-12 mb-8 order-4">
                            <div className="flex -space-x-1">
                                {viewerProducts.map((_, i) => (
                                    <button key={i} onClick={() => setViewerIdx(i)} className={`relative w-8 h-8 rounded-full border border-black/50 transition-all duration-700 flex items-center justify-center group ${viewerIdx === i ? 'bg-[#C8AA6E] scale-110 z-10 shadow-[0_0_20px_rgba(200,170,110,0.4)]' : 'bg-[#C8AA6E]/20 hover:bg-[#C8AA6E]/40'}`}>
                                        {viewerIdx === i && <span className="material-icons-outlined text-[10px] text-black animate-pulse">verified</span>}
                                    </button>
                                ))}
                            </div>
                            <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold">
                                {viewerIdx + 1} <span className="text-[#C8AA6E]/40">/</span> {viewerProducts.length}
                            </span>
                        </div>
                    )}
                </div>

                {/* GLOBAL NAVIGATION ARROWS (Coffee Only) */}
                {viewerProducts.length > 1 && activeViewerCat === 'coffee' && (
                    <>
                        <button
                            onClick={prevProduct}
                            className="absolute left-2 md:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center text-white/40 hover:text-[#C8AA6E] border-none lg:border lg:border-white/10 lg:rounded-full transition-all hover:scale-110 active:scale-90"
                        >
                            <span className="material-icons-outlined text-5xl md:text-4xl lg:text-3xl">chevron_left</span>
                        </button>
                        <button
                            onClick={nextProduct}
                            className="absolute right-2 md:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center text-white/40 hover:text-[#C8AA6E] border-none lg:border lg:border-white/10 lg:rounded-full transition-all hover:scale-110 active:scale-90"
                        >
                            <span className="material-icons-outlined text-5xl md:text-4xl lg:text-3xl">chevron_right</span>
                        </button>
                    </>
                )}
            </header>

            <ProductDetailsModal
                product={selectedModalProduct || currentProduct}
                isOpen={isDetailsOpen}
                onClose={() => {
                    setIsDetailsOpen(false);
                    setTimeout(() => setSelectedModalProduct(null), 300); // Clear after fade out
                }}
            />
            <Footer />
        </div>
    );
};

export default HomePage;
