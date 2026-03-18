import { Navigate, useParams } from 'react-router-dom';

import {
    useAdminBook, useAdminBookCover, usePublicBook,
    usePublicBookCover, useResponsive, useSetTabTitle
} from '../../hooks';
import BookPageDesktop from './BookPageDesktop';
import BookPageMobile from './BookPageMobile';
import { ADMIN, NOT_FOUND } from '../../constants';
import { useAuthContext } from '../../contexts';


const BookPage = () => {
    const { isDesktop } = useResponsive();
    const { bookId } = useParams();
    const { userType, hasExistingLoggedInUser } = useAuthContext();
    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedUserType = userType || existingLoggedInData?.userType;

    useSetTabTitle('Book');

    const isAdmin = resolvedUserType === ADMIN;

    const useBook = isAdmin ? useAdminBook : usePublicBook;
    const useBookCover = isAdmin ? useAdminBookCover : usePublicBookCover;

    const parsedBookId = parseInt(bookId || '-1', 10);
    const isValidBookId = Number.isInteger(parsedBookId) && parsedBookId > 0;

    if (!isValidBookId) {
        return <Navigate to={NOT_FOUND} replace />;
    }

    return (
        <>
            {
                isDesktop
                    ?
                    <BookPageDesktop bookId={parsedBookId} useBook={useBook} useBookCover={useBookCover} />
                    :
                    <BookPageMobile bookId={parsedBookId} useBook={useBook} useBookCover={useBookCover} />
            }
        </>
    );
};

export default BookPage;