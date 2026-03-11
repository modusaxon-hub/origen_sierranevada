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

    // Sync Fresh Stock from Supabase
    const syncStock = async (items: CartItem[]) => {
        if (items.length === 0) return items;

        try {
            const updatedItems = await Promise.all(items.map(async item => {
                const compositeParts = item.id.split(':');
                let productId = compositeParts[0];
                let variantId = compositeParts.length > 1 ? compositeParts[1] : null;

                // Support old dash-separated IDs (UUID = 36 chars)
                if (compositeParts.length === 1 && item.id.length > 36) {
                    productId = item.id.substring(0, 36);
                    variantId = item.id.substring(37);
                }

                let freshStock = item.maxStock || 0; // Initialize with existing maxStock or 0
                try {
                    if (variantId && variantId !== 'base' && variantId.length === 36) {
                        const { data, error } = await supabase.from('product_variants').select('stock').eq('id', variantId).single();
                        if (!error && data) freshStock = data.stock; // Only update if no error and data exists
                    } else {
                        const { data, error } = await supabase.from('products').select('stock').eq('id', productId).single();
                        if (!error && data) freshStock = data.stock; // Only update if no error and data exists
                    }
                } catch (e) {
                    console.error("Stock sync error:", e);
                }

                return { ...item, maxStock: freshStock, qty: Math.min(item.qty, freshStock) };
            }));
            return updatedItems;
        } catch (e) {
            return items;
        }
    };

    // Auto-Sync whenever cart is opened
    useEffect(() => {
        if (isCartOpen && cartItems.length > 0) {
            syncStock(cartItems).then(updated => {
                // Only set if items actually changed (prevent loops)
                if (JSON.stringify(updated) !== JSON.stringify(cartItems)) {
                    setCartItems(updated);
                }
            });
        }
    }, [isCartOpen]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = async (newItem: CartItem) => {
        // Validación inmediata ante click
        let stockToEnforce = newItem.maxStock;

        // Si no tenemos stock, intentamos buscarlo una vez más antes de insertar
        if (stockToEnforce === undefined) {
            const compositeParts = newItem.id.split(':');
            const productId = compositeParts[0];
            const variantId = compositeParts.length > 1 ? compositeParts[1] : null;

            try {
                if (variantId && variantId !== 'base' && variantId.length === 36) {
                    const { data } = await supabase.from('product_variants').select('stock').eq('id', variantId).single();
                    if (data) stockToEnforce = data.stock;
                } else {
                    const { data } = await supabase.from('products').select('stock').eq('id', productId).single();
                    if (data) stockToEnforce = data.stock;
                }
            } catch (e) {
                console.error("Error fetching stock in addToCart:", e);
            }
        }

        setCartItems(prev => {
            const existing = prev.find(item => item.id === newItem.id);
            if (existing) {
                const maxAllowed = stockToEnforce ?? existing.maxStock ?? Infinity;
                const newQty = Math.min(existing.qty + newItem.qty, maxAllowed);
                return prev.map(item =>
                    item.id === newItem.id
                        ? { ...item, qty: newQty, maxStock: maxAllowed !== Infinity ? maxAllowed : item.maxStock }
                        : item
                );
            }
            const clampedQty = Math.min(newItem.qty, stockToEnforce ?? Infinity);
            return [...prev, { ...newItem, qty: clampedQty, maxStock: stockToEnforce }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = async (id: string, newQty: number) => {
        if (newQty < 1) {
            removeFromCart(id);
            return;
        }

        // Si es un incremento, verificamos stock fresco para evitar sobreventa por "spam click"
        const currentItem = cartItems.find(i => i.id === id);
        if (newQty > (currentItem?.qty || 0)) {
            const compositeParts = id.split(':');
            const productId = compositeParts[0];
            const variantId = compositeParts.length > 1 ? compositeParts[1] : null;

            let freshStock = currentItem.maxStock || currentItem.qty;
            try {
                if (variantId && variantId !== 'base' && variantId.length === 36) {
                    const { data, error } = await supabase.from('product_variants').select('stock').eq('id', variantId).single();
                    if (!error && data) freshStock = data.stock;
                } else {
                    const { data, error } = await supabase.from('products').select('stock').eq('id', productId).single();
                    if (!error && data) freshStock = data.stock;
                }
            } catch (e) {
                console.error("Error fetching fresh stock in updateQty:", e);
            }

            setCartItems(prev => prev.map(item => {
                if (item.id !== id) return item;
                return { ...item, maxStock: freshStock, qty: Math.min(newQty, freshStock) };
            }));
        } else {
            // Decremento no requiere verificación de stock
            setCartItems(prev => prev.map(item => {
                if (item.id !== id) return item;
                // For decrements, we don't need to re-fetch maxStock, just update qty
                return { ...item, qty: newQty };
            }));
        }
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
