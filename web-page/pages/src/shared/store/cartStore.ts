import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    name: string;
    sub: string;
    price: number;
    qty: number;
    img: string;
}

interface CartState {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    updateQty: (id: string, qty: number) => void;
    total: number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            total: 0,
            addToCart: (item) => {
                const { cart } = get();
                const existing = cart.find((i) => i.id === item.id);
                let newCart;
                if (existing) {
                    newCart = cart.map((i) =>
                        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
                    );
                } else {
                    newCart = [...cart, item];
                }
                set({ cart: newCart, total: calculateTotal(newCart) });
            },
            removeFromCart: (id) => {
                const { cart } = get();
                const newCart = cart.filter((i) => i.id !== id);
                set({ cart: newCart, total: calculateTotal(newCart) });
            },
            updateQty: (id, qty) => {
                const { cart } = get();
                const newCart = cart.map((i) =>
                    i.id === id ? { ...i, qty } : i
                );
                set({ cart: newCart, total: calculateTotal(newCart) });
            },
            clearCart: () => set({ cart: [], total: 0 }),
        }),
        {
            name: 'cart-storage',
        }
    )
);

const calculateTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
};
