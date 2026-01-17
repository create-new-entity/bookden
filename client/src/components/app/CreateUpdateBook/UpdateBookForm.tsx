import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    CreateUpdateBookResolver, type CreateUpdateBookData
} from '../../../validations';
import type { Book } from '../../../types';
import BookFormFields from './BookFormFields';
import { useDeleteBook, useRestoreBook } from '../../../hooks';


type UpdateBookFormProps = {
    book: Book;
    onSubmit: (data: CreateUpdateBookData) => void;
};

const UpdateBookForm = (props: UpdateBookFormProps) => {
    const { book, onSubmit } = props;
    const { deleteBookCoverAndBookData } = useDeleteBook(book.bookId);
    const { restoreBookMutation } = useRestoreBook(book.bookId);

    const onRestore = () => {
        restoreBookMutation.mutate();
    };


    const defaultValues: CreateUpdateBookData = {
        title: book.title,
        authors: book.authors,
        synopsis: book.synopsis || '',
        isbn: book.isbn,
        yearPublished: book.yearPublished,
        price: book.price,
        pages: book.pages,
        tags: book.tags,
        language: book.language
    };
    
    const form = useForm<CreateUpdateBookData>({
        defaultValues,
        resolver: zodResolver(CreateUpdateBookResolver) as Resolver<CreateUpdateBookData>
    });

    const { handleSubmit } = form;

    return (
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
            <BookFormFields
                form={form}
                mode='update'
                onDelete={deleteBookCoverAndBookData}
                onRestore={onRestore}
                isDeletedBook={book.deletedAt !== null}
            />
        </form>
    );
};

export default UpdateBookForm;