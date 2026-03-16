import { createContext, useContext, useState, type ReactNode } from 'react';

type CartItem = {
    bookId: number;
    quantity: number;
};

type CartContextValue = {
    items: CartItem[];
    addToCart: (bookId: number) => void;
    removeFromCart: (bookId: number) => void;
    updateQuantity: (bookId: number, quantity: number) => void;
    clearCart: () => void;
    isInCart: (bookId: number) => boolean;
};

const defaultContextValue: CartContextValue = {
    items: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    isInCart: () => false
};

const CartContext = createContext(defaultContextValue);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (bookId: number) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.bookId === bookId);
            if (existing) {
                return prev.map((item) =>
                    item.bookId === bookId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { bookId, quantity: 1 }];
        });
    };

    const removeFromCart = (bookId: number) => {
        setItems((prev) => prev.filter((item) => item.bookId !== bookId));
    };

    const updateQuantity = (bookId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(bookId);
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.bookId === bookId ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => setItems([]);

    const value: CartContextValue = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart: (bookId: number) => items.some((item) => item.bookId === bookId)
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

const useCartContext = () => {
    return useContext(CartContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export default useCartContext;
