import { useNavigate } from 'react-router-dom';

import { BookListLayout } from '../components';
import { useAdminBooksList, useDeleteBook, useRestoreBook } from '../hooks';
import { getAdminBookActions } from '../actions';
import type { Book } from '../types';


const AdminBookManagementPage = () => {
    const { booksList, params, updateParams, priceRangeMeta } = useAdminBooksList();
    const { deleteBookCoverAndBookData } = useDeleteBook();
    const { restoreBookMutation } = useRestoreBook();
    const navigate = useNavigate();

    const onEdit = (bookId: number) => {
        navigate(`/books/${bookId}/update`);
    };

    const onDelete = (bookId: number) => {
        deleteBookCoverAndBookData(bookId);
    };

    const onRestore = (bookId: number) => {
        restoreBookMutation.mutate(bookId);
    };

    const handlers = { onEdit, onDelete, onRestore };
    const getActions = (book: Book) => {
        return getAdminBookActions(book, handlers);
    };

    return (
        <BookListLayout
            mode='admin'
            booksList={booksList}
            getActions={getActions}
            params={params}
            updateParams={updateParams}
            priceRangeMeta={priceRangeMeta}
        />
    );
};

export default AdminBookManagementPage;