import * as R from 'ramda';

import { getPublicBookActions } from '../actions';
import { BookListLayout } from '../components';
import { useAuthContext, useCartContext, type BookInCart } from '../contexts';
import { useSetTabTitle, useBooksWishListMutation, useBooksWishList } from '../hooks';
import type { Book } from '../types';
import { Stack, Typography } from '@mui/material';


const WishListPage = () => {
    const { booksList, params, updateParams, priceRangeMeta } = useBooksWishList();
    const { addToWishList, removeFromWishList } = useBooksWishListMutation();
    useSetTabTitle('Wishlist');
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
        <>
            <Stack
                direction={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                sx={{ marginTop: '1rem' }}
            >
                <Typography variant='body1'>
                    Only wishlisted books will be shown in this page.
                </Typography>
            </Stack>
            <BookListLayout
                mode='customer'
                booksList={booksList}
                getActions={getActions}
                params={params}
                updateParams={updateParams}
                priceRangeMeta={priceRangeMeta}
            />
        </>
    );
};

export default WishListPage;