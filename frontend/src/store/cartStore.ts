import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    selectedVariants?: { [key: string]: string };
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const items = get().items;
                
                // Create a unique identifier including variants
                const variantKey = item.selectedVariants 
                    ? JSON.stringify(item.selectedVariants)
                    : '';
                const uniqueId = `${item.id}-${variantKey}`;
                
                // Find existing item with same product and variants
                const existingItem = items.find((i) => {
                    const iVariantKey = i.selectedVariants 
                        ? JSON.stringify(i.selectedVariants)
                        : '';
                    return i.id === item.id && iVariantKey === variantKey;
                });

                if (existingItem) {
                    // Update quantity of existing item
                    set({
                        items: items.map((i) => {
                            const iVariantKey = i.selectedVariants 
                                ? JSON.stringify(i.selectedVariants)
                                : '';
                            return i.id === item.id && iVariantKey === variantKey
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i;
                        }),
                    });
                } else {
                    // Add new item
                    set({ items: [...items, item] });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                } else {
                    set({
                        items: get().items.map((i) =>
                            i.id === id ? { ...i, quantity } : i
                        ),
                    });
                }
            },

            clearCart: () => {
                set({ items: [] });
            },

            getTotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
