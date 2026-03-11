
import React from 'react';
import { Product } from '@/shared/types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface AccessoryCardProps {
    product: Product;
    onClick?: () => void;
}

export const AccessoryCard: React.FC<AccessoryCardProps> = ({ product, onClick }) => {
    const { language, formatPrice } = useLanguage();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const name = product.name[language] || product.name['es'];
    const description = product.description[language] || product.description['es'];

    return (
        <article
            onClick={onClick}
            className="relative w-full aspect-[3/5] rounded-[2rem] overflow-hidden group cursor-pointer shadow-2xl shadow-black/50 hover:scale-[1.02] transition-transform duration-500"
        >
            {/* Background: Dark Modern Glassmorphism (Replaces Texture) */}
            <div className="absolute inset-0 z-0 bg-[#080A09]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-10"></div>
                {/* Subtle spotlight effect */}
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[#C5A065]/10 blur-[100px] rounded-full"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between">

                {/* Header: Title */}
                <div className="text-center space-y-3 relative pt-4">
                    {/* Title: Playfair, Medium size, Persistent */}
                    <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#EAE2B7] italic tracking-wide leading-tight drop-shadow-md">
                        {name}
                    </h2>
                    {/* Description: Secondary Sans Font */}
                    <p className="font-sans text-white/60 text-sm font-light leading-relaxed line-clamp-2 max-w-[90%] mx-auto">
                        {description}
                    </p>
                </div>

                {/* Product Image (Fills container) */}
                <div className="flex-1 relative my-4 overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out">
                    <img
                        src={product.image_url}
                        alt={name}
                        className="w-full h-full object-cover filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Footer: Price & Button */}
                <div className="flex flex-col items-center gap-5 mb-2">
                    {/* Price: Playfair, elegant */}
                    <span className="font-serif font-medium text-2xl text-[#EAE2B7] tracking-wider">
                        {formatPrice(product.price)}
                    </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if ((product.stock ?? 0) <= 0) return;
                            addToCart({
                                id: product.id,
                                name: name,
                                sub: product.category,
                                price: product.price,
                                img: product.image_url,
                                qty: 1,
                                maxStock: product.stock
                            });
                        }}
                        disabled={(product.stock ?? 0) <= 0}
                        className={`px-8 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 w-full md:w-auto min-w-[140px] ${(product.stock ?? 0) <= 0
                            ? 'bg-gray-500/20 text-white/20 cursor-not-allowed'
                            : 'bg-[#C5A065] text-black hover:bg-[#D4B075] hover:shadow-[0_0_15px_rgba(197,160,101,0.3)]'
                            }`}
                    >
                        {(product.stock ?? 0) <= 0
                            ? (language === 'es' ? 'AGOTADO' : 'SOLD OUT')
                            : (language === 'es' ? 'COMPRAR' : 'BUY NOW')}
                    </button>
                </div>
            </div>
        </article>
    );
};
