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
import HistoriaSection from './home/HistoriaSection';
import MapaOrigenSection from './home/MapaOrigenSection';
import TestimoniosSection from './home/TestimoniosSection';

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
    const [selectedSubGrind, setSelectedSubGrind] = useState('Media');
    const [customWeight, setCustomWeight] = useState<number>(0);

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
        // Resetear molienda
        const variantsWithStock = currentProduct?.variants?.filter(v => v.stock > 0) || [];
        const hasEnGrano = variantsWithStock.some(v => !v.grind || v.grind === 'En Grano');
        setSelectedGrind(hasEnGrano ? 'En Grano' : 'Molido');
        setSelectedSubGrind('Media');
    }, [currentProduct?.id]);

    // Obtener variante seleccionada y precio actual
    const selectedVariant = currentProduct?.variants?.find(v => v.id === selectedVariantId);
    const currentPrice = selectedVariant?.price ?? currentProduct?.price ?? 0;
    // Aplicar descuento solo en Cafetal para usuarios registrados
    const isCafetal = currentProduct?.category === 'cafetal' || currentProduct?.category === 'coffee';
    const finalPrice = (user && isCafetal) ? currentPrice * 0.9 : currentPrice;

    // Obtener todas las variantes (sin filtrar por stock para que sean visibles en selectores)
    const availableVariants = currentProduct?.variants || [];

    // Calcular sub-moliendas disponibles
    const availableSubGrinds = ['Fina', 'Media', 'Gruesa'].filter(grosor =>
        availableVariants.some(v => v.grind === `Molido ${grosor}`)
    );

    // Mantener sincronizado selectedVariantId al cambiar el tipo de molienda
    useEffect(() => {
        if (isCafetal && availableVariants.length > 0) {
            const validVariants = availableVariants.filter(v => {
                const variantGrindMatch = v.grind ? (v.grind.includes('Molido') ? 'Molido' : v.grind) : null;
                if (variantGrindMatch) {
                    if (variantGrindMatch === 'Molido' && selectedGrind === 'Molido') {
                        if (availableSubGrinds.length > 0 && v.grind.includes('Molido ')) {
                            return v.grind === `Molido ${selectedSubGrind}`;
                        }
                        return true;
                    }
                    return variantGrindMatch === selectedGrind;
                }
                return true;
            });
            if (validVariants.length > 0 && !validVariants.some(v => v.id === selectedVariantId)) {
                setSelectedVariantId(validVariants[0].id);
            }
        }
    }, [selectedGrind, selectedSubGrind, availableVariants, isCafetal, selectedVariantId]);


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

        // Construir nombre con variante y molienda inteligente
        const variantName = selectedVariant?.name ?? '';
        const productName = currentProduct.name[lang] || currentProduct.name.es || currentProduct.name.en;

        let extraInfo = '';
        if (isCafetal) {
            let finalGrind = selectedGrind;
            if (selectedGrind === 'Molido' && availableSubGrinds.length > 0 && selectedSubGrind) {
                finalGrind = `Molido ${selectedSubGrind}`;
            }
            extraInfo = `[${finalGrind}]`;
        } else if (selectedVariant?.units_per_package) {
            extraInfo = `(${selectedVariant.units_per_package} uds x ${selectedVariant.weight_per_unit || ''}g)`;
        }

        const displayName = `${productName} ${variantName} ${extraInfo}`.trim();

        // Subtítulo descriptivo basado en la categoría
        const badge = currentProduct.badge?.[lang] || currentProduct.badge?.[lang === 'es' ? 'en' : 'es'] || 'Origen Sierra Nevada';

        addToCart({
            id: `${currentProduct.id}-${selectedVariantId || 'base'}`,
            name: displayName,
            sub: badge,
            price: finalPrice,
            qty: 1,
            img: currentProduct.image_url || '/cafe_malu_full_composition.png'
        });
    };

    return (
        <div className="min-h-screen bg-[#050806] text-white">
            <header className="relative min-h-[100vh] w-full overflow-hidden flex flex-col items-center justify-center pt-32 md:pt-36 lg:pt-24 xl:pt-28 [@media(orientation:landscape)_and_(max-height:800px)]:pt-20">

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
                                        <div className="relative w-[180px] h-[225px] md:w-[250px] md:h-[315px] lg:w-[220px] lg:h-[285px] xl:w-[315px] xl:h-[415px] 2xl:w-[450px] 2xl:h-[570px] shrink-0 mx-auto flex items-center justify-center" key={currentProduct.id}>

                                            {/* Dual Ring Portal - Depth Effect with SVG Surgical Clip */}
                                            <div className="absolute inset-0 flex items-center justify-center translate-y-[10px]">
                                                <div className="relative w-full aspect-square">
                                                    {/* SVG ClipPath Definition (Hidden) */}
                                                    <svg width="0" height="0" className="absolute">
                                                        <defs>
                                                            <clipPath id="hero-surgical-clip" clipPathUnits="objectBoundingBox">
                                                                {/* Path: Start far above (-10) to avoid any top clipping, then curve the bottom half */}
                                                                <path d="M 0,-10 L 1,-10 L 1,0.5 A 0.5,0.5 0 0,1 0,0.5 Z" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>

                                                    {/* Background Layer: Top Half-Ring (Behind Product) */}
                                                    <div className="hero-top-ring inset-0"></div>

                                                    {/* Middle Layer: Product Image with SVG clip-path for bottom-only clipping */}
                                                    <div className="hero-pop-svg-mask absolute inset-0">
                                                        <div className="absolute inset-x-0 bottom-0 translate-y-[18%]">
                                                            <img
                                                                src={currentProduct.image_url || '/cafe_malu_full_composition.png'}
                                                                alt={currentProduct.name[lang]}
                                                                className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-float-hero-pop"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Foreground Layer: Bottom Half-Ring (In Front of Product) */}
                                                    <div className="hero-bottom-ring inset-0"></div>
                                                </div>
                                            </div>

                                            {/* Subtle base shadow - Restored to original aesthetic */}
                                            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-4/5 h-[20px] bg-black/40 blur-2xl rounded-full -rotate-2 z-10"></div>
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


                                            <p className="text-white/40 text-sm md:text-base leading-relaxed italic max-w-md font-light text-justify mx-auto lg:mx-0">
                                                "{currentProduct.description[lang]}"
                                            </p>
                                        </div>

                                        {/* VARIATION SELECTORS */}
                                        <div className="w-full space-y-6">
                                            {/* Selector Dinámico de Molienda Inteligente (Molido / En Grano) */}
                                            {isCafetal && availableVariants.length > 0 && (
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold block text-center lg:text-left">
                                                            {lang === 'es' ? 'Tipo de Molienda' : 'Grind Type'}
                                                        </span>
                                                        <div className="flex justify-center lg:justify-start gap-2 max-w-sm mx-auto lg:mx-0 w-full">
                                                            {['En Grano', 'Molido'].map(gType => {
                                                                const hasStock = availableVariants.some(v => !v.grind || (v.grind.includes('Molido') ? 'Molido' : v.grind) === gType);
                                                                return (
                                                                    <button
                                                                        key={gType}
                                                                        onClick={() => hasStock && setSelectedGrind(gType)}
                                                                        disabled={!hasStock}
                                                                        className={`flex-1 py-1.5 text-[11px] font-bold tracking-widest transition-all rounded-sm border flex items-center justify-center ${selectedGrind === gType
                                                                            ? 'bg-[#C8AA6E] border-[#C8AA6E] text-black shadow-[0_0_10px_rgba(200,170,110,0.3)]'
                                                                            : hasStock
                                                                                ? 'border-white/10 text-white/40 hover:border-white/30'
                                                                                : 'border-white/5 text-white/20 opacity-40 cursor-not-allowed'
                                                                            }`}
                                                                    >
                                                                        {gType}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Selector secundario de grosor de molienda si elige Molido */}
                                                    {selectedGrind === 'Molido' && availableSubGrinds.length > 0 && (
                                                        <div className="space-y-2 animate-fade-in">
                                                            <span className="text-[10px] text-[#C8AA6E]/60 uppercase tracking-[0.4em] font-bold block text-center lg:text-left">
                                                                {lang === 'es' ? 'Grosor de Molienda' : 'Grind Size'}
                                                            </span>
                                                            <div className="flex justify-center lg:justify-start gap-2 max-w-sm mx-auto lg:mx-0">
                                                                {availableSubGrinds.map(grosor => (
                                                                    <button
                                                                        key={grosor}
                                                                        onClick={() => setSelectedSubGrind(grosor)}
                                                                        className={`flex-1 py-1.5 text-[10px] font-bold tracking-widest transition-all rounded-sm border flex items-center justify-center ${selectedSubGrind === grosor
                                                                            ? 'bg-white/10 border-[#C8AA6E] text-[#C8AA6E]'
                                                                            : 'border-white/5 text-white/30 hover:border-white/20'
                                                                            }`}
                                                                    >
                                                                        {grosor}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

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
                                                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 max-w-sm mx-auto lg:mx-0">
                                                        {availableVariants
                                                            .filter(variant => {
                                                                if (isCafetal) {
                                                                    // Match the currently selected grind (En Grano or Molido)
                                                                    const variantGrindMatch = variant.grind ? (variant.grind.includes('Molido') ? 'Molido' : variant.grind) : null;
                                                                    if (variantGrindMatch) {
                                                                        if (variantGrindMatch === 'Molido' && selectedGrind === 'Molido') {
                                                                            if (availableSubGrinds.length > 0 && variant.grind.includes('Molido ')) {
                                                                                return variant.grind === `Molido ${selectedSubGrind}`;
                                                                            }
                                                                            return true;
                                                                        }
                                                                        return variantGrindMatch === selectedGrind;
                                                                    }
                                                                    // If variant grind is empty, it works for BOTH
                                                                    return true;
                                                                }
                                                                return true;
                                                            })
                                                            .map(variant => (
                                                                <button
                                                                    key={variant.id}
                                                                    onClick={() => setSelectedVariantId(variant.id)}
                                                                    className={`px-3 py-1.5 min-w-[60px] text-[11px] font-bold tracking-widest transition-all duration-500 rounded-sm border flex flex-col items-center justify-center ${selectedVariantId === variant.id
                                                                        ? 'bg-[#C8AA6E] border-[#C8AA6E] text-black shadow-[0_0_10px_rgba(200,170,110,0.3)]'
                                                                        : 'border-white/10 text-white/40 hover:border-white/30'
                                                                        }`}
                                                                >
                                                                    <span>{variant.name}</span>
                                                                    {variant.units_per_package && <span className="opacity-70 text-[8px] mt-0.5">{variant.units_per_package} uds</span>}
                                                                </button>
                                                            ))}
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
                                                    disabled={(availableVariants.length > 0 && !selectedVariantId) || availableVariants.length === 0 || !currentProduct?.available || (selectedVariant && selectedVariant.stock <= 0)}
                                                    className="px-12 py-5 rounded bg-[#C5A065] text-black text-sm font-bold uppercase tracking-widest hover:bg-[#D4B075] hover:shadow-[0_0_20px_rgba(197,160,101,0.3)] transition-all duration-300 disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700 disabled:cursor-not-allowed btn-shine-container btn-shine-effect"
                                                >
                                                    {(!currentProduct?.available || availableVariants.length === 0 || (selectedVariant && selectedVariant.stock <= 0))
                                                        ? (lang === 'es' ? 'AGOTADO' : 'OUT OF STOCK')
                                                        : (lang === 'es' ? 'AÑADIR AL CARRITO' : 'ADD TO CART')}
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

            {selectedModalProduct && (
                <ProductDetailsModal
                    product={selectedModalProduct}
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                />
            )}

            <HistoriaSection />
            <MapaOrigenSection />
            <TestimoniosSection />

            <Footer />
        </div>
    );
};

export default HomePage;
