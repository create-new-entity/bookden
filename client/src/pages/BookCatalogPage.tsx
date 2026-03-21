import * as R from 'ramda';

import { getPublicBookActions } from '../actions';
import { BookListLayout } from '../components';
import { useAuthContext, useCartContext, type BookInCart } from '../contexts';
import { usePublicBooksList, useSetTabTitle, useBooksWishListMutation } from '../hooks';
import type { Book } from '../types';


const BookCatalogPage = () => {
    const { booksList, params, updateParams, priceRangeMeta } = usePublicBooksList();
    const { addToWishList, removeFromWishList } = useBooksWishListMutation();
    useSetTabTitle('Books');
    const { userType } = useAuthContext();
    const { isInCart, addToCart, removeFromCart } = useCartContext();

    const onAddToWishlist = (bookId: number) => {
        addToWishList.mutate(bookId);
    };

    const onRemoveFromWishlist = (bookId: number) => {
        removeFromWishList.mutate(bookId);
    };

    const onAddToCart = (book: BookInCart) => {
        addToCart(R.pick(['bookId', 'title', 'price'], book));
    };

    const onRemoveFromCart = (book: BookInCart) => {
        removeFromCart(R.pick(['bookId', 'title', 'price'], book));
    };

    const handlers = { onAddToWishlist, onRemoveFromWishlist, onAddToCart, onRemoveFromCart };
    const getActions = (book: Book) => {
        const isSuperAdminOrAdmin = userType === 'superadmin' || userType === 'admin';
        if(isSuperAdminOrAdmin) {
            return [];
        }
        return getPublicBookActions(book, handlers, isInCart(book.bookId));
    };


    return (
        <BookListLayout
            mode='customer'
            booksList={booksList}
            getActions={getActions}
            params={params}
            updateParams={updateParams}
            priceRangeMeta={priceRangeMeta}
        />
    );
};

export default BookCatalogPage;