import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/services/supabaseClient';

export interface CartItem {
    id: string; // Changed to string for flexibility
    name: string;
    sub: string;
    price: number;
    qty: number;
    img: string;
    maxStock?: number; // Stock máximo disponible para validación
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQty: (id: string, newQty: number) => void;
    clearCart: () => void;
    cartTotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Sync Fresh Stock on Mount
    useEffect(() => {
        const syncStock = async () => {
            if (cartItems.length === 0) return;

            const updatedItems = await Promise.all(cartItems.map(async item => {
                try {
                    const compositeParts = item.id.split(':');
                    let productId = compositeParts[0];
                    let variantId = compositeParts.length > 1 ? compositeParts[1] : null;

                    // Support old dash-separated IDs (UUID = 36 chars)
                    if (compositeParts.length === 1 && item.id.length > 36) {
                        productId = item.id.substring(0, 36);
                        variantId = item.id.substring(37);
                    }

                    let freshStock = 0;
                    if (variantId && variantId !== 'base') {
                        const { data } = await supabase.from('product_variants').select('stock').eq('id', variantId).single();
                        freshStock = data?.stock ?? 0;
                    } else {
                        const { data } = await supabase.from('products').select('stock').eq('id', productId).single();
                        freshStock = data?.stock ?? 0;
                    }

                    return { ...item, maxStock: freshStock, qty: Math.min(item.qty, freshStock) };
                } catch (e) {
                    return item;
                }
            }));

            // Only update if there are changes to avoid infinite loop
            const hasChanges = JSON.stringify(updatedItems) !== JSON.stringify(cartItems);
            if (hasChanges) {
                setCartItems(updatedItems);
            }
        };

        syncStock();
    }, []); // Only on mount

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (newItem: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === newItem.id);
            if (existing) {
                const maxAllowed = newItem.maxStock ?? existing.maxStock ?? Infinity;
                const newQty = Math.min(existing.qty + newItem.qty, maxAllowed);
                return prev.map(item =>
                    item.id === newItem.id
                        ? { ...item, qty: newQty, maxStock: maxAllowed !== Infinity ? maxAllowed : item.maxStock }
                        : item
                );
            }
            // Limitar qty inicial al stock disponible
            const maxAllowed = newItem.maxStock ?? Infinity;
            const clampedQty = Math.min(newItem.qty, maxAllowed);
            return [...prev, { ...newItem, qty: clampedQty }];
        });
        setIsCartOpen(true); // Auto open cart on add
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = (id: string, newQty: number) => {
        if (newQty < 1) {
            removeFromCart(id);
            return;
        }
        setCartItems(prev => prev.map(item => {
            if (item.id !== id) return item;
            const maxAllowed = item.maxStock ?? Infinity;
            return { ...item, qty: Math.min(newQty, maxAllowed) };
        }));
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQty,
            clearCart,
            cartTotal,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
