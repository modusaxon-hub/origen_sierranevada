import React from 'react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

interface AntojitoCardProps {
    product: Product;
    onClick?: () => void;
}

export const AntojitoCard: React.FC<AntojitoCardProps> = ({ product, onClick }) => {
    const { language, formatPrice } = useLanguage();
    const { addToCart } = useCart();
    const lang = (language as 'es' | 'en') || 'es';

    const name = product.name[lang] || product.name['es'];

    return (
        <div
            onClick={onClick}
            className="group relative w-full aspect-square cursor-pointer transition-transform duration-500 hover:scale-105"
        >
            {/* SINGLE COMPOSITE IMAGE (Designed by Visual Team) */}
            <div className="relative w-full h-full flex items-center justify-center">
                <img
                    src={product.image_url}
                    alt={name}
                    className="w-full h-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Hover Overlay with Action */}
            <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 bg-black/20 rounded-xl backdrop-blur-[2px]">
                <h3 className="text-[#EAE2B7] font-serif text-lg text-center px-4 leading-tight drop-shadow-md">
                    {name}
                </h3>
                <p className="text-[#C5A065] font-mono text-sm font-bold bg-black/60 px-2 py-1 rounded">
                    {formatPrice(product.price)}
                </p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                            id: product.id,
                            name: name,
                            price: product.price,
                            image: product.image_url,
                            qty: 1
                        });
                    }}
                    className="bg-[#C5A065] text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded shadow-lg hover:bg-[#D4B075] active:scale-95 transition-all"
                >
                    {lang === 'es' ? 'Añadir' : 'Add'}
                </button>
            </div>
        </div>
    );
};
