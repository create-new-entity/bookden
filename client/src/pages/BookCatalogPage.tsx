

import { getPublicBookActions } from '../actions';
import { BookListLayout } from '../components';
import { useAuthContext } from '../contexts';
import { useBooksList, useSetTabTitle, useBooksWishListMutation } from '../hooks';
import type { Book } from '../types';


const BookCatalogPage = () => {
    const { booksList, params, updateParams, priceRangeMeta } = useBooksList();
    const { addToWishList, removeFromWishList } = useBooksWishListMutation();
    useSetTabTitle('Books');
    const { userType } = useAuthContext();

    const onAddToWishlist = (bookId: number) => {
        addToWishList.mutate(bookId);
    };

    const onRemoveFromWishlist = (bookId: number) => {
        removeFromWishList.mutate(bookId);
    };

    const handlers = { onAddToWishlist, onRemoveFromWishlist };
    const getActions = (book: Book) => {
        const isSuperAdminOrAdmin = userType === 'superadmin' || userType === 'admin';
        if(isSuperAdminOrAdmin) {
            return [];
        }
        return getPublicBookActions(book, handlers);
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