
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    type CreateUpdateBookData, CreateUpdateBookResolver,
    CURRENT_YEAR
} from '../../../validations';
import BookFormFields from './BookFormFields';


type CreateBookFormProps = {
    onSubmit: (data: CreateUpdateBookData) => void;
};


const CreateBookForm = ({ onSubmit }: CreateBookFormProps) => {

    const defaultValues: CreateUpdateBookData = {
        title: '',
        authors: [],
        synopsis: '',
        isbn: '',
        yearPublished: CURRENT_YEAR,
        price: 0,
        pages: 1,
        tags: [],
        language: 'en'
    };
    
    const form = useForm<CreateUpdateBookData>({
        defaultValues,
        resolver: zodResolver(CreateUpdateBookResolver) as Resolver<CreateUpdateBookData>
    });

    const { handleSubmit } = form;

    return (
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
            <BookFormFields form={form} mode='create' />
        </form>
    );
};

export default CreateBookForm;