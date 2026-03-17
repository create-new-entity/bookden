import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import type { Book } from '../types';
import { roundTo2 } from '../utility/utility';


export type BookInCart = Pick<Book, 'bookId' | 'title' | 'price'>;

export type CartItem = {
    book: BookInCart;
    quantity: number;
};

const CART_STORAGE_KEY = 'bookden_cart';

type CartContextValue = {
    items: CartItem[];
    addToCart: (book: BookInCart) => void;
    reduceFromCart: (book: BookInCart) => void;
    removeFromCart: (book: BookInCart) => void;
    updateQuantity: (book: BookInCart, quantity: number) => void;
    clearCart: () => void;
    isInCart: (bookId: BookInCart['bookId']) => boolean;
    totalCost: number;
    totalNumberOfBooksInCart: number;
};

const defaultContextValue: CartContextValue = {
    items: [],
    addToCart: () => {},
    reduceFromCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    isInCart: (_bookId: BookInCart['bookId']) => false,
    totalCost: 0,
    totalNumberOfBooksInCart: 0
};

const CartContext = createContext(defaultContextValue);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems, removeCartFromLocalStorage] = useLocalStorage<CartItem[]>(CART_STORAGE_KEY, []);

    const unroundedTotalCost = items.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
    const totalCost = roundTo2(unroundedTotalCost);
    const totalNumberOfBooksInCart = items.reduce((sum, item) => sum + item.quantity, 0) || 0;


    const addToCart = (book: BookInCart) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.book.bookId === book.bookId);
            if (existing) {
                return prev.map((item) =>
                    item.book.bookId === book.bookId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { book, quantity: 1 }];
        });
    };

    const reduceFromCart = (book: BookInCart) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.book.bookId === book.bookId);
            if (existing) {
                return prev
                    .map((item) => item.book.bookId === book.bookId ? { ...item, quantity: item.quantity - 1 } : item)
                    .filter((item) => item.quantity > 0); // Remove items with quantity 0 or less
            }
            return prev;
        });
    };

    const removeFromCart = (book: BookInCart) => {
        setItems((prev) => prev.filter((item) => item.book.bookId !== book.bookId));
    };

    const updateQuantity = (book: BookInCart, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(book);
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.book.bookId === book.bookId ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setItems([]);
        removeCartFromLocalStorage();
    };

    const value: CartContextValue = {
        items,
        addToCart,
        reduceFromCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart: (bookId: BookInCart['bookId']) => items.some((item) => item.book.bookId === bookId),
        totalCost,
        totalNumberOfBooksInCart
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
