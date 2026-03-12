import React, { useState } from 'react';
import { Product } from '@/shared/types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';

interface ProductDetailsModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, isOpen, onClose }) => {
    const { language } = useLanguage();
    const { addToCart } = useCart();
    const lang = (language as 'es' | 'en') || 'es';
    const [activeDetailTab, setActiveDetailTab] = useState<'story' | 'traceability'>('story');
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    // Sync state when product changes
    React.useEffect(() => {
        if (product && product.variants && product.variants.length > 0) {
            setSelectedVariantId(product.variants[0].id);
        } else {
            setSelectedVariantId(null);
        }
    }, [product?.id]);

    if (!isOpen || !product) return null;
    const selectedVariant = product.variants?.find(v => v.id === selectedVariantId);

    const handleAddToCart = () => {
        const variantName = selectedVariant?.name ?? '';
        const productName = product.name[lang] || product.name.es || product.name.en;

        let extraInfo = '';
        if (selectedVariant?.grind) {
            const grindText = selectedVariant.grind.includes('Molido') ? 'Molido' : selectedVariant.grind;
            extraInfo = `[${grindText}]`;
        } else if (selectedVariant?.units_per_package) {
            extraInfo = `(${selectedVariant.units_per_package} uds x ${selectedVariant.weight_per_unit || ''}g)`;
        }

        const displayName = `${productName} ${variantName} ${extraInfo}`.trim();

        const stock = selectedVariant ? selectedVariant.stock : product.stock;

        addToCart({
            id: selectedVariantId ? `${product.id}:${selectedVariantId}` : product.id,
            name: displayName,
            sub: product.badge?.[lang] || 'Origen Sierra Nevada',
            price: selectedVariant ? selectedVariant.price : product.price,
            qty: 1,
            img: product.image_url || '/cafe_malu_full_composition.png',
            maxStock: stock
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-fade-in" onClick={onClose} />
            <div className="relative w-full max-w-4xl bg-[#080A09] border border-[#C8AA6E]/20 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-card-appear">
                {/* Tabs / Header */}
                <div className="flex border-b border-white/5 bg-white/[0.02]">
                    {product.category === 'accesorios' || product.category === 'accessories' || product.category === 'antojitos' ? (
                        <div className="flex-1 py-4 md:py-6 pl-8 flex items-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8AA6E]">
                                {lang === 'es' ? 'Detalles del Producto' : 'Product Details'}
                            </span>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setActiveDetailTab('story')}
                                className={`flex-1 py-4 md:py-6 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${activeDetailTab === 'story' ? 'text-[#C8AA6E] bg-white/[0.03]' : 'text-white/30 hover:text-white'}`}
                            >
                                {lang === 'es' ? 'Nuestra Historia' : 'Our Story'}
                            </button>
                            <button
                                onClick={() => setActiveDetailTab('traceability')}
                                className={`flex-1 py-4 md:py-6 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${activeDetailTab === 'traceability' ? 'text-[#C8AA6E] bg-white/[0.03]' : 'text-white/30 hover:text-white'}`}
                            >
                                {lang === 'es' ? 'Trazabilidad' : 'Traceability'}
                            </button>
                        </>
                    )}
                    <button onClick={onClose} className="px-6 md:px-8 border-l border-white/5 text-white/20 hover:text-red-500 transition-colors">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-8 md:p-12 lg:p-16 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {product.category === 'accesorios' || product.category === 'accessories' || product.category === 'antojitos' ? (
                        // ACCESSORY & ANTOJITO CONTENT
                        <div className="space-y-8 animate-fade-in">
                            <div className="space-y-4">
                                <h3 className="text-3xl md:text-5xl font-serif text-white italic leading-none">
                                    {product.name[lang] || product.name.es}
                                </h3>
                                <div className="h-[1px] w-24 bg-[#C8AA6E]/50"></div>
                            </div>

                            <p className="text-white/70 leading-relaxed text-lg font-light text-justify max-w-2xl">
                                {product.description[lang] || product.description.es}
                            </p>

                            {/* Specs/Variants if available */}
                            {product.variants && product.variants.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-[#C8AA6E] font-bold uppercase tracking-widest">{lang === 'es' ? 'Seleccionar Presentación' : 'Select Size'}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {product.variants?.filter(v => {
                                                if (product.variants?.some(v => v.grind) && selectedVariant?.grind) {
                                                    const cGrind = selectedVariant.grind.includes('Molido') ? 'Molido' : selectedVariant.grind;
                                                    const vGrind = v.grind ? (v.grind.includes('Molido') ? 'Molido' : v.grind) : cGrind;
                                                    return vGrind === cGrind;
                                                }
                                                return true;
                                            }).map(v => (
                                                <button
                                                    key={v.id}
                                                    onClick={() => setSelectedVariantId(v.id)}
                                                    className={`px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all flex flex-col items-center justify-center ${selectedVariantId === v.id
                                                        ? 'bg-[#C8AA6E] text-black border-[#C8AA6E]'
                                                        : 'border border-white/10 text-white/40 hover:border-white/30'
                                                        }`}
                                                >
                                                    <span>{v.name}</span>
                                                    {v.grind && <span className="opacity-70 text-[8px] mt-0.5 whitespace-nowrap leading-none">{v.grind.includes('Molido') ? 'Molido' : v.grind}</span>}
                                                    {v.units_per_package && <span className="opacity-70 text-[8px] mt-0.5 leading-none">{v.units_per_package} uds</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                product.weight > 0 && (
                                    <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                        <div>
                                            <p className="text-[9px] text-[#C8AA6E] font-bold uppercase tracking-widest mb-1">{lang === 'es' ? 'Peso' : 'Weight'}</p>
                                            <p className="text-xl font-serif text-white">{product.weight}g</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        // COFFEE CONTENT (Existing Logic)
                        activeDetailTab === 'story' ? (
                            <div className="space-y-6 md:space-y-8 animate-fade-in">
                                <h3 className="text-3xl md:text-4xl font-serif text-white italic">
                                    {lang === 'es' ? 'El Legado de la Montaña' : 'Mountain Legacy'}
                                </h3>
                                <p className="text-white/50 leading-relaxed text-base md:text-lg font-light text-justify">
                                    {product.story?.[lang] || (lang === 'es' ? "Cargando el misticismo de la sierra..." : "Loading mountain mysticism...")}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-8 md:space-y-12 animate-fade-in text-left">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                                    {[
                                        { label: lang === 'es' ? 'Origen' : 'Origin', val: product.origin || 'Sierra Nevada' },
                                        { label: lang === 'es' ? 'Altitud' : 'Altitude', val: '1,500 - 1,900 msnm' },
                                        { label: lang === 'es' ? 'Procesamiento' : 'Processing', val: 'Lavado / Proceso Natural' },
                                        { label: lang === 'es' ? 'Tipo' : 'Type', val: product.variants?.find(v => v.grind)?.grind || (lang === 'es' ? 'En Grano / Molido' : 'Whole Bean / Ground') }
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <p className="text-[9px] text-[#C8AA6E] font-bold uppercase tracking-widest">{item.label}</p>
                                            <p className="text-sm md:text-base text-white font-serif">{item.val}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-8 border-t border-white/5">
                                    <div className="p-6 md:p-8 border border-white/5 rounded-xl md:rounded-2xl bg-white/[0.01] flex flex-col justify-center">
                                        <p className="text-xs md:text-sm text-white/40 italic leading-relaxed text-center">
                                            {lang === 'es'
                                                ? "Cada grano ha sido seleccionado bajo la supervisión de expertos tostadores para asegurar que la frecuencia de la montaña llegue intacta a su taza."
                                                : "Each bean has been selected under the supervision of expert roasters to ensure the mountain's frequency reaches your cup intact."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-6 md:p-8 border-t border-white/5 bg-black/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-[9px] text-white/20 uppercase tracking-[0.4em] text-center sm:text-left">
                        {lang === 'es' ? 'Cosecha Consagrada • Lote Limitado' : 'Consecrated Harvest • Limited Batch'}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        disabled={!product.available || (product.variants && product.variants.length > 0 && !selectedVariantId) || (selectedVariant && selectedVariant.stock <= 0)}
                        className="w-full sm:w-auto bg-[#C8AA6E] text-black px-10 py-3 text-[10px] font-bold uppercase tracking-widest rounded transition-all hover:bg-[#D4B075] hover:shadow-[0_0_15px_rgba(200,170,110,0.3)] transform active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {!product.available || (selectedVariant && selectedVariant.stock <= 0)
                            ? (lang === 'es' ? 'AGOTADO' : 'OUT OF STOCK')
                            : (lang === 'es' ? 'AÑADIR AL CARRITO' : 'ADD TO CART')}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default ProductDetailsModal;
