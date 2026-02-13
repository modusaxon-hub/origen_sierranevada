import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

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

    if (!isOpen) return null;

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name[lang] || product.name.es,
            sub: product.badge?.[lang] || 'Premium',
            price: product.price, // Note: price adjustment for users usually happens in the page level or cart context
            qty: 1,
            img: product.image_url || '/cafe_malu_full_composition.png'
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

                            {/* Accessory Specs if available (checking traits or plain metadata) */}
                            {product.weight > 0 && (
                                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                    <div>
                                        <p className="text-[9px] text-[#C8AA6E] font-bold uppercase tracking-widest mb-1">{lang === 'es' ? 'Peso' : 'Weight'}</p>
                                        <p className="text-xl font-serif text-white">{product.weight}g</p>
                                    </div>
                                    {/* Feel free to add more metadata fields here if user requests */}
                                </div>
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
                                        { label: lang === 'es' ? 'Origen' : 'Origin', val: 'Sierra Nevada' },
                                        { label: lang === 'es' ? 'Altitud' : 'Altitude', val: '1,800 msnm' },
                                        { label: lang === 'es' ? 'Procesamiento' : 'Processing', val: 'Lavado' },
                                        { label: lang === 'es' ? 'Puntaje SCA' : 'SCA Score', val: product.score || '86+' }
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <p className="text-[9px] text-[#C8AA6E] font-bold uppercase tracking-widest">{item.label}</p>
                                            <p className="text-lg md:text-xl text-white font-serif">{item.val}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 md:p-8 border border-white/5 rounded-xl md:rounded-2xl bg-white/[0.01]">
                                    <p className="text-xs md:text-sm text-white/40 italic leading-relaxed">
                                        {lang === 'es'
                                            ? "Cada grano ha sido seleccionado bajo la supervisión de expertos tostadores para asegurar que la frecuencia de la montaña llegue intacta a su taza."
                                            : "Each bean has been selected under the supervision of expert roasters to ensure the mountain's frequency reaches your cup intact."}
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-6 md:p-8 border-t border-white/5 bg-black/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-[9px] text-white/20 uppercase tracking-[0.4em] text-center sm:text-left">
                        {lang === 'es' ? 'Ritual Consagrado • Lote Limitado' : 'Consecrated Ritual • Limited Batch'}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        className="w-full sm:w-auto bg-[#C5A065] text-black px-10 py-3 text-[10px] font-bold uppercase tracking-widest rounded transition-all hover:bg-[#D4B075] hover:shadow-[0_0_15px_rgba(197,160,101,0.3)] transform active:scale-95 shadow-lg shadow-primary/20"
                    >
                        {lang === 'es' ? 'AÑADIR AL CARRITO' : 'ADD TO CART'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
