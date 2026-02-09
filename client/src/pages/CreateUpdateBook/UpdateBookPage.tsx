import { useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useBook, useBookCover, useImagePreview, useSetTabTitle } from '../../hooks';
import BookEditorLayout from './BookEditorLayout';
import { UpdateBookForm } from '../../components';
import type { CreateUpdateBookData } from '../../validations';
import { urlToFile } from '../../utility';
import { BOOK, NOT_FOUND, PLACE_HOLDER_BOOK_COVER } from '../../constants';
import useUpdateBook from '../../hooks/useUpdateBook';
import { useNotificationContext } from '../../contexts';



const UpdateBookPage = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { handleShowNotification } = useNotificationContext();
    const { bookId } = useParams();
    const parsedBookId = parseInt(bookId || '-1', 10);

    const bookQuery = useBook(parsedBookId);
    const bookCover = useBookCover(parsedBookId);
    const { updateBookMutation } = useUpdateBook(parsedBookId);
    const image = useImagePreview({ initialImageUrl: bookCover.bookCoverBlob.objectUrl, placeholderImageUrl: PLACE_HOLDER_BOOK_COVER });

    useSetTabTitle('Update Book');

    const isValidBookId = Number.isInteger(parsedBookId) && parsedBookId > 0;

    if (!isValidBookId) {
        return <Navigate to={NOT_FOUND} replace />;
    }

    if (bookQuery.isLoading) return null;
    if (!bookQuery.data) return null;

    const onSubmit = async (data: CreateUpdateBookData) => {
        updateBookMutation.mutate(data);

        if (image.file) {
            // User has selected a new image.
            bookCover.updateBookCoverMutation.mutate(image.file);
            return;
        }
    
        if (image.isCleared) {
            // User has cleared the image. Use the placeholder image.
            const placeholderFile = await urlToFile(
                PLACE_HOLDER_BOOK_COVER,
                'noBookCoverPlaceholder.jpg',
                'image/jpeg'
            );
            bookCover.updateBookCoverMutation.mutate(placeholderFile);
        }
    };

    const bookCoverHasBeenChanged = image.file || image.isCleared;
    const bookCoverHasBeenUpdated = bookCoverHasBeenChanged && bookCover.updateBookCoverMutation.isSuccess;
    

    const bothBookCoverAndBookDataAreUpdated = updateBookMutation.isSuccess && ( bookCoverHasBeenUpdated || true ); // true is for the use case when book cover is not changed but book data is updated.
    if (bothBookCoverAndBookDataAreUpdated) {
        handleShowNotification('Book updated successfully.');
        return <Navigate to={`${BOOK.replace(':bookId', parsedBookId.toString())}`} replace />;
    }
  
    return (
        <BookEditorLayout imageProps={{ ...image, inputRef, disableActionButtons: bookQuery.data.deletedAt !== null }}>
            <UpdateBookForm onSubmit={onSubmit} book={bookQuery.data}/>
        </BookEditorLayout>
    );
};

  
export default UpdateBookPage;