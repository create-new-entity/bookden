import { useRef } from 'react';

import { useImagePreview, useCreateBook, useSetTabTitle } from '../../hooks';
import { CreateBookForm } from '../../components';
import type { CreateUpdateBookData } from '../../validations';
import { urlToFile } from '../../utility';
import BookEditorLayout from './BookEditorLayout';
import { PLACE_HOLDER_BOOK_COVER } from '../../constants';



const CreateBookPage = () => {
    const image = useImagePreview({ placeholderImageUrl: PLACE_HOLDER_BOOK_COVER });
    const inputRef = useRef<HTMLInputElement>(null);
    const { createBookMutation } = useCreateBook();
  
    useSetTabTitle('Create Book');
  
    const onSubmit = async (data: CreateUpdateBookData) => {
        let coverImage: File;

        if (image.file) {
            coverImage = image.file;
        } else {
            coverImage = await urlToFile(
                PLACE_HOLDER_BOOK_COVER,
                'noBookCoverPlaceholder.jpg',
                'image/jpeg'
            );
        }

        createBookMutation.mutate({ data, coverImage });
    };
  
    return (
        <BookEditorLayout imageProps={{ ...image, inputRef }}>
            <CreateBookForm onSubmit={onSubmit} />
        </BookEditorLayout>
    );
};

export default CreateBookPage;