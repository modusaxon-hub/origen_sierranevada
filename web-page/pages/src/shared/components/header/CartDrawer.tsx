import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

const CartDrawer: React.FC = () => {
    const navigate = useNavigate();
    const { t, formatPrice } = useLanguage();
    const { cartItems, removeFromCart, updateQty, cartTotal, isCartOpen, setIsCartOpen } = useCart();

    return (
        <div className={`fixed inset-0 z-50 overflow-hidden ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => setIsCartOpen(false)}
            />
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-surface-light dark:bg-surface-dark shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="font-display text-2xl text-gray-900 dark:text-white">{t('nav.cart_title')}</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-red-500 transition-colors">
                        <span className="material-icons-outlined text-2xl">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <span className="material-icons-outlined text-6xl mb-4 opacity-30">shopping_basket</span>
                            <p className="font-display text-lg">{t('nav.cart_empty')}</p>
                            <button onClick={() => { setIsCartOpen(false); navigate('/subscription'); }} className="mt-4 text-primary font-bold text-xs uppercase tracking-widest hover:underline">{t('nav.cart_start')}</button>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="flex gap-4 items-center animate-fade-in group">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-black/20 rounded-lg p-2 flex-shrink-0 border border-gray-200 dark:border-white/5 group-hover:border-primary/30 transition-colors">
                                    <img src={item.img} className="w-full h-full object-contain filter sepia-[.2]" alt={item.name} />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-display text-gray-900 dark:text-white text-sm leading-tight">{item.name}</h3>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-tight">{item.sub}</p>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-md border border-gray-200 dark:border-white/10">
                                                <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors">
                                                    <span className="material-icons-outlined text-sm">remove</span>
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-white">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                                    disabled={item.maxStock !== undefined && item.qty >= item.maxStock}
                                                    className={`w-8 h-8 flex items-center justify-center transition-colors ${item.maxStock !== undefined && item.qty >= item.maxStock ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed bg-red-500/5' : 'text-gray-500 hover:text-primary'}`}
                                                >
                                                    <span className="material-icons-outlined text-sm">add</span>
                                                </button>
                                            </div>
                                            <span className="font-bold text-primary text-sm">{formatPrice(item.price * item.qty)}</span>
                                        </div>
                                        {item.maxStock && item.qty >= item.maxStock && (
                                            <p className="text-[9px] text-orange-500 dark:text-orange-400 font-bold uppercase tracking-wider mt-1">Stock máx: {item.maxStock} uds</p>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                                    <span className="material-icons-outlined">delete_outline</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-accent text-xs font-bold text-gray-500 uppercase tracking-widest">{t('nav.subtotal')}</span>
                            <span className="font-display text-2xl text-gray-900 dark:text-white">{formatPrice(cartTotal)}</span>
                        </div>
                        <button
                            onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-lg uppercase tracking-widest transition-all transform active:scale-95 shadow-lg shadow-primary/20"
                        >
                            {t('nav.checkout')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
