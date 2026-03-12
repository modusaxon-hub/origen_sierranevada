
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services/productService';
import { Product } from '@/shared/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/shared/components/Footer';
import SEO from '@/shared/components/SEO';
import ProductDetailsModal from '@/shared/components/ProductDetailsModal';
import LockedOverlay from '@/shared/components/LockedOverlay';


const Catalog: React.FC = () => {
    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter') || 'all';
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { language, formatPrice } = useLanguage();
    const lang = (language as 'es' | 'en') || 'es';

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Dynamic state for selected variants in the catalog
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

    // Detail Modal State
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Advanced Filters State
    const [filters, setFilters] = useState({
        provider: 'all',
        brand: 'all',
        weight: 'all',
        grainType: 'all'
    });


    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data, error } = await productService.getAllProducts();
            if (!error) {
                setProducts(data);
                // Initialize default variants
                const defaults: Record<string, string> = {};
                data.forEach(p => {
                    if (p.variants && p.variants.length > 0) {
                        defaults[p.id] = p.variants[0].id;
                    }
                });
                setSelectedVariants(defaults);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        const variantId = selectedVariants[product.id];
        const variant = product.variants?.find(v => v.id === variantId);

        // Validar stock antes de agregar
        const stock = variant ? variant.stock : product.stock;
        if (stock !== undefined && stock <= 0) return;

        const price = variant ? variant.price : product.price;
        const nameSuffix = variant ? ` (${variant.name})` : '';

        addToCart({
            id: variant ? `${product.id}:${variant.id}` : product.id,
            name: (product.name[lang] || product.name.es) + nameSuffix,
            sub: `${product.score ? `SCA ${product.score} • ` : ''}${product.badge?.[lang] || ''}`,
            price: user ? price * 0.9 : price,
            qty: 1,
            img: product.image_url || '/cafe_malu_waterfall_minca.png',
            maxStock: stock,
        });
    };

    const getDisplayPrice = (product: Product) => {
        const variantId = selectedVariants[product.id];
        const variant = product.variants?.find(v => v.id === variantId);
        return variant ? variant.price : product.price;
    };

    const filteredProducts = products.filter(p => {
        // Primary Category Filter
        if (filter !== 'all') {
            const matchesCategory =
                (filter === 'coffee' && (p.category === 'cafetal' || p.category === 'coffee')) ||
                (filter === 'accessories' && (p.category === 'accesorios' || p.category === 'accessories')) ||
                (filter === 'derivatives' && (p.category === 'antojitos' || p.category === 'derivatives')) ||
                (p.category === filter);
            if (!matchesCategory) return false;
        }

        // Secondary Advanced Filters
        if (filters.provider !== 'all' && p.origin !== filters.provider) return false;
        if (filters.brand !== 'all' && p.brand !== filters.brand) return false;
        if (filters.weight !== 'all' && p.weight.toString() !== filters.weight) return false;
        if (filters.grainType !== 'all' && p.grain_type !== filters.grainType) return false;

        return true;
    });

    return (
        <div className="min-h-screen bg-[#050806] text-white pt-32 font-sans overflow-x-hidden relative">
            {!user && (
                <LockedOverlay
                    title={lang === 'es' ? 'Catálogo Reservado' : 'Reserved Catalog'}
                    message={lang === 'es'
                        ? 'Explora nuestras cosechas de autor iniciando sesión en tu cuenta de Socio.'
                        : 'Explore our signature harvests by logging into your Member account.'}
                />
            )}

            <SEO
                title="Catálogo de Origen"
                description="Explora nuestra selección exclusiva de cafés de especialidad. Desde granos de altura hasta ediciones limitadas de la Sierra Nevada."
            />

            <div className={!user ? 'blur-2xl pointer-events-none select-none h-screen overflow-hidden' : ''}>
                {/* Background Ambience */}
                <div className="fixed inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C8AA6E]/10 rounded-full blur-[150px] animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4A3B22]/20 rounded-full blur-[120px]"></div>
                </div>

                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <header className="mb-16 text-center space-y-6">
                        <div className="inline-block py-1 px-5 border border-[#C8AA6E]/30 rounded-full bg-[#C8AA6E]/5 animate-fade-in">
                            <span className="text-[10px] text-[#C8AA6E] font-bold uppercase tracking-[0.4em]">Cosechas de Autor</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-serif tracking-tighter animate-slide-up">
                            {filter === 'coffee' || filter === 'cafetal' ? 'Café de Especialidad' :
                                filter === 'accessories' || filter === 'accesorios' ? 'Accesorios de Café' :
                                    filter === 'derivatives' || filter === 'antojitos' ? 'Derivados de la Sierra' : 'Catálogo de Origen'}
                        </h1>
                    </header>

                    {/* Advanced Filters */}
                    <div className="mb-16 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md">
                        <div className="flex flex-wrap gap-8">
                            {/* Filto por Proveedor */}
                            <div className="flex-1 min-w-[200px] space-y-3">
                                <label className="text-[10px] text-[#C8AA6E] font-bold uppercase tracking-widest">{lang === 'es' ? 'Proveedor' : 'Provider'}</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8AA6E] transition-colors"
                                    onChange={(e) => setFilters(prev => ({ ...prev, provider: e.target.value }))}
                                    value={filters.provider}
                                >
                                    <option value="all">{lang === 'es' ? 'Todos los Proveedores' : 'All Providers'}</option>
                                    {[...new Set(products.map(p => p.origin || 'Sierra Nevada'))].map(origin => (
                                        <option key={origin} value={origin}>{origin}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro por Marca */}
                            <div className="flex-1 min-w-[200px] space-y-3">
                                <label className="text-[10px] text-[#C8AA6E] font-bold uppercase tracking-widest">{lang === 'es' ? 'Marca' : 'Brand'}</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8AA6E] transition-colors"
                                    onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                                    value={filters.brand}
                                >
                                    <option value="all">{lang === 'es' ? 'Todas las Marcas' : 'All Brands'}</option>
                                    {[...new Set(products.map(p => p.brand).filter(Boolean))].map(brand => (
                                        <option key={brand} value={brand!}>{brand}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro por Peso */}
                            <div className="flex-1 min-w-[200px] space-y-3">
                                <label className="text-[10px] text-[#C8AA6E] font-bold uppercase tracking-widest">{lang === 'es' ? 'Peso' : 'Weight'}</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8AA6E] transition-colors"
                                    onChange={(e) => setFilters(prev => ({ ...prev, weight: e.target.value }))}
                                    value={filters.weight}
                                >
                                    <option value="all">{lang === 'es' ? 'Cualquier Peso' : 'Any Weight'}</option>
                                    <option value="250">250g</option>
                                    <option value="500">500g</option>
                                    <option value="1000">1kg</option>
                                </select>
                            </div>

                            {/* Filtro por Tipo de Grano */}
                            <div className="flex-1 min-w-[200px] space-y-3">
                                <label className="text-[10px] text-[#C8AA6E] font-bold uppercase tracking-widest">{lang === 'es' ? 'Tipo de Grano' : 'Grain Type'}</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8AA6E] transition-colors"
                                    onChange={(e) => setFilters(prev => ({ ...prev, grainType: e.target.value }))}
                                    value={filters.grainType}
                                >
                                    <option value="all">{lang === 'es' ? 'Todos los Tipos' : 'All Types'}</option>
                                    {[...new Set(products.map(p => p.grain_type).filter(Boolean))].map(type => (
                                        <option key={type} value={type!}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6">
                            <div className="w-16 h-16 border-2 border-[#C8AA6E]/10 border-t-[#C8AA6E] rounded-full animate-spin"></div>
                            <p className="text-[#C8AA6E] text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Sintonizando la frecuencia de la montaña...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12 pb-40">
                            {filteredProducts.map((product, idx) => (
                                <div
                                    key={product.id}
                                    className="group relative animate-fade-in"
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    {/* Premium Exhibition Card (Malu Style Base) */}
                                    <div className="relative aspect-[4/5] mb-12 flex items-center justify-center">
                                        {/* Gold Ring Background */}
                                        <div className="absolute inset-4 rounded-full border border-[#C8AA6E]/20 group-hover:border-[#C8AA6E]/60 transition-all duration-700 bg-gradient-to-b from-white/[0.02] to-transparent shadow-[0_0_40px_rgba(0,0,0,0.4)]"></div>

                                        {/* Product Image with Pop-out Effect */}
                                        <div className="relative w-full h-full p-12 transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-4">
                                            {/* Shadow Layer */}
                                            <div className="absolute inset-0 bg-radial-gradient from-black/20 to-transparent opacity-0 group-hover:opacity-40 transition-opacity"></div>

                                            <img
                                                src={product.image_url || '/cafe_malu_full_composition.png'}
                                                alt={product.name[lang]}
                                                className="w-full h-full object-contain filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.6)]"
                                            />

                                            {/* Pop-out Overlay (Optional if using clip-path, but standard drop shadow works great here) */}
                                        </div>

                                        {/* Badge Overlay */}
                                        <div className="absolute top-8 right-8 flex flex-col gap-2 scale-90">
                                            <span className="bg-[#C8AA6E] text-black px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest shadow-lg">
                                                {product.badge?.[lang] || product.category}
                                            </span>
                                            {product.score && (
                                                <span className="bg-black/80 backdrop-blur-md text-[#C8AA6E] border border-[#C8AA6E]/40 px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest">
                                                    SCA {product.score}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="space-y-6 px-4">
                                        <div className="space-y-2">
                                            <h3 className="text-4xl font-serif text-white group-hover:text-[#C8AA6E] transition-colors duration-500 tracking-tight">
                                                {product.name[lang]}
                                            </h3>
                                            <p className="text-white/40 text-[11px] leading-relaxed line-clamp-2 italic font-light">
                                                {product.description[lang]}
                                                <button
                                                    onClick={() => { setSelectedProduct(product); setIsDetailsOpen(true); }}
                                                    className="ml-1 text-[#C8AA6E] hover:text-white transition-colors font-bold uppercase text-[9px] tracking-widest inline-flex items-center gap-0.5 group/link"
                                                >
                                                    {lang === 'es' ? 'Conoce más' : 'Detail'}
                                                    <span className="material-icons-outlined text-[10px] group-hover/link:translate-x-0.5 transition-transform">east</span>
                                                </button>
                                            </p>
                                        </div>

                                        {/* Variants Picker (Presentation Sizes) */}
                                        {product.variants && product.variants.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {product.variants.map(v => (
                                                    <button
                                                        key={v.id}
                                                        onClick={() => setSelectedVariants(prev => ({ ...prev, [product.id]: v.id }))}
                                                        className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${selectedVariants[product.id] === v.id
                                                            ? 'bg-[#C8AA6E] text-black border-[#C8AA6E] scale-105'
                                                            : 'border border-white/10 text-white/40 hover:border-white/30'
                                                            }`}
                                                    >
                                                        {v.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Pricing & CTA */}
                                        <div className="flex items-end justify-between pt-4 border-t border-white/5">
                                            <div className="space-y-1">
                                                {user && (
                                                    <p className="text-[9px] text-[#C8AA6E] font-bold uppercase tracking-widest">Socio -10%</p>
                                                )}
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-3xl font-display ${user ? 'text-[#C8AA6E]' : 'text-white'}`}>
                                                        {formatPrice(user ? getDisplayPrice(product) * 0.9 : getDisplayPrice(product))}
                                                    </span>
                                                    {user && (
                                                        <span className="text-sm text-white/20 line-through decoration-white/20">
                                                            {formatPrice(getDisplayPrice(product))}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-14 h-14 rounded-full bg-[#C8AA6E] text-black flex items-center justify-center hover:brightness-110 hover:scale-110 active:scale-95 transition-all duration-500 shadow-[0_0_20px_rgba(200,170,110,0.2)]"
                                                title="Añadir al Pedido"
                                            >
                                                <span className="material-icons-outlined text-xl">add_shopping_cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details Modal */}
                {selectedProduct && (
                    <ProductDetailsModal
                        product={selectedProduct}
                        isOpen={isDetailsOpen}
                        onClose={() => setIsDetailsOpen(false)}
                    />
                )}
                <Footer />
            </div>
        </div>
    );
};

export default Catalog;
