
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '@/services/productService';
import { Product } from '@/shared/types';
import { useCart } from '@/shared/store/CartContext';
import { useAuth } from '@/shared/store/AuthContext';
import { useLanguage } from '@/shared/store/LanguageContext';
import Footer from '@/shared/components/Footer';
import SEO from '@/shared/components/SEO';
import ProductDetailsModal from '@/shared/components/ProductDetailsModal';


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

        const price = variant ? variant.price : product.price;
        const nameSuffix = variant ? ` (${variant.name})` : '';

        addToCart({
            id: variant ? `${product.id}-${variant.id}` : product.id,
            name: (product.name[lang] || product.name.es) + nameSuffix,
            sub: `${product.score ? `SCA ${product.score} • ` : ''}${product.badge?.[lang] || ''}`,
            price: user ? price * 0.9 : price,
            qty: 1,
            img: product.image_url || '/cafe_malu_waterfall_minca.png'
        });
    };

    const getDisplayPrice = (product: Product) => {
        const variantId = selectedVariants[product.id];
        const variant = product.variants?.find(v => v.id === variantId);
        return variant ? variant.price : product.price;
    };

    const filteredProducts = products.filter(p => filter === 'all' || p.category === filter);

    return (
        <div className="min-h-screen bg-[#050806] text-white pt-32 font-sans overflow-x-hidden">
            <SEO
                title="Catálogo de Origen"
                description="Explora nuestra selección exclusiva de cafés de especialidad. Desde granos de altura hasta ediciones limitadas de la Sierra Nevada."
            />

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C5A065]/10 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4A3B22]/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <header className="mb-24 text-center space-y-6">
                    <div className="inline-block py-1 px-5 border border-[#C5A065]/30 rounded-full bg-[#C5A065]/5 animate-fade-in">
                        <span className="text-[10px] text-[#C5A065] font-bold uppercase tracking-[0.4em]">Cosechas de Autor</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-serif tracking-tighter animate-slide-up">
                        {filter === 'coffee' ? 'Café de Especialidad' :
                            filter === 'accessories' ? 'Accesorios de Ritual' :
                                filter === 'derivatives' ? 'Derivados de la Sierra' : 'Catálogo de Origen'}
                    </h1>
                    <p className="max-w-2xl mx-auto text-white/50 text-sm md:text-base leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Cada producto es una pieza de colección. Cultivados, procesados y seleccionados bajo el estándar más exigente del misticismo de la Sierra Nevada.
                    </p>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="w-16 h-16 border-2 border-[#C5A065]/10 border-t-[#C5A065] rounded-full animate-spin"></div>
                        <p className="text-[#C5A065] text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Sintonizando la frecuencia de la montaña...</p>
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
                                    <div className="absolute inset-4 rounded-full border border-[#C5A065]/20 group-hover:border-[#C5A065]/60 transition-all duration-700 bg-gradient-to-b from-white/[0.02] to-transparent shadow-[0_0_40px_rgba(0,0,0,0.4)]"></div>

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
                                        <span className="bg-[#C5A065] text-black px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest shadow-lg">
                                            {product.badge?.[lang] || product.category}
                                        </span>
                                        {product.score && (
                                            <span className="bg-black/80 backdrop-blur-md text-[#C5A065] border border-[#C5A065]/40 px-3 py-1 rounded-sm text-[9px] font-bold uppercase tracking-widest">
                                                SCA {product.score}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="space-y-6 px-4">
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-serif text-white group-hover:text-[#C5A065] transition-colors duration-500 tracking-tight">
                                            {product.name[lang]}
                                        </h3>
                                        <p className="text-white/40 text-[11px] leading-relaxed line-clamp-2 italic font-light">
                                            {product.description[lang]}
                                            <button
                                                onClick={() => { setSelectedProduct(product); setIsDetailsOpen(true); }}
                                                className="ml-1 text-[#C5A065] hover:text-white transition-colors font-bold uppercase text-[9px] tracking-widest inline-flex items-center gap-0.5 group/link"
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
                                                        ? 'bg-[#C5A065] text-black border-[#C5A065] scale-105'
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
                                                <p className="text-[9px] text-[#C5A065] font-bold uppercase tracking-widest">Ritual Socio -10%</p>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <span className={`text-3xl font-display ${user ? 'text-[#C5A065]' : 'text-white'}`}>
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
                                            className="w-14 h-14 rounded-full bg-[#C5A065] text-black flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all duration-500 shadow-[0_0_20px_rgba(197,160,101,0.2)]"
                                            title="Añadir al Ritual"
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
    );
};

export default Catalog;
