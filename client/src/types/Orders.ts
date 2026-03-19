import type { Book } from './Books';

    
export type OrderItem = {
    bookId: Book['bookId'];
    quantity: number;
};

export type Order = {
    items: OrderItem[];
};