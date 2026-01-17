import { Navigate, useParams } from 'react-router-dom';
import { useResponsive, useSetTabTitle } from '../../hooks';
import BookPageDesktop from './BookPageDesktop';
import BookPageMobile from './BookPageMobile';
import { NOT_FOUND } from '../../constants';


const BookPage = () => {
    const { isDesktop } = useResponsive();
    const { bookId } = useParams();
    useSetTabTitle('Book');

    const parsedBookId = parseInt(bookId || '-1', 10);
    const isValidBookId = Number.isInteger(parsedBookId) && parsedBookId > 0;

    if (!isValidBookId) {
        return <Navigate to={NOT_FOUND} replace />;
    }


    return (
        <>
            {
                isDesktop ? <BookPageDesktop bookId={parsedBookId} /> : <BookPageMobile bookId={parsedBookId} />
            }
        </>
    );
};

export default BookPage;