import React, { useState } from 'react';
import { Product, LanguageCode } from '../types';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    lang?: LanguageCode;
    onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    lang = 'es',
    onAddToCart
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Helper para obtener texto localizado
    const t = (obj: any) => obj?.[lang] || obj?.['es'] || '';
    const name = t(product.name);
    const badge = t(product.badge);
    const description = t(product.description);
    const tags = product.tags ? (product.tags[lang] || product.tags['es'] || []) : [];

    return (
        <div
            className="group relative bg-[#FDFBF7] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#E0A367]/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badge */}
            {badge && (
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 text-xs font-serif tracking-widest bg-[#1C2923] text-[#D4AF37] rounded-full uppercase shadow-lg">
                        {badge}
                    </span>
                </div>
            )}

            {/* Score (si existe) */}
            {product.score && (
                <div className="absolute top-4 right-4 z-20">
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                        <span className="text-xs font-bold text-[#1C2923]">SCA</span>
                        <span className="text-lg font-serif text-[#C05D2D]">{product.score}</span>
                    </div>
                </div>
            )}

            {/* Image Container */}
            <div className={`relative h-64 w-full overflow-hidden bg-[#E8E6E1] flex items-center justify-center p-6 transition-colors duration-500 ${isHovered ? 'bg-[#E0DFD8]' : ''}`}>
                {/* Background Blob Effect (falso orgánico) */}
                <div
                    className="absolute inset-0 opacity-20 transition-transform duration-700 ease-out transform"
                    style={{
                        background: `radial-gradient(circle at 50% 50%, ${product.color || '#E0A367'} 0%, transparent 70%)`,
                        transform: isHovered ? 'scale(1.5)' : 'scale(1)'
                    }}
                />

                <img
                    src={product.image_url}
                    alt={name}
                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-2"
                />

                {/* Overlay secundario si existe (para efecto hover) */}
                {product.overlay_url && (
                    <img
                        src={product.overlay_url}
                        alt=""
                        className={`absolute inset-0 z-10 w-full h-full object-contain transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}
            </div>

            {/* Content */}
            <div className="p-6 relative">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {tags.slice(0, 3).map((tag: string, idx: number) => (
                        <span key={idx} className="text-[10px] uppercase tracking-wider text-[#6B705C] bg-[#6B705C]/10 px-2 py-0.5 rounded-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className="text-2xl font-serif text-[#1C2923] mb-2 leading-tight group-hover:text-[#C05D2D] transition-colors">
                    {name}
                </h3>

                <p className="text-sm text-[#5C5C5C] font-light line-clamp-2 mb-4 h-10">
                    {description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E0A367]/20">
                    <span className="text-xl font-serif text-[#1C2923]">
                        ${product.price.toFixed(2)}
                    </span>

                    <button
                        onClick={() => onAddToCart?.(product)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                            ${isHovered
                                ? 'bg-[#1C2923] text-[#D4AF37] translate-x-0 opacity-100'
                                : 'bg-[#1C2923] text-white/50 translate-x-0 opacity-80'}
                            hover:bg-[#C05D2D] hover:text-white
                        `}
                    >
                        <span className="text-xs uppercase tracking-widest font-medium">
                            {lang === 'es' ? 'Comprar' : 'Buy'}
                        </span>
                        <ShoppingBag size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
