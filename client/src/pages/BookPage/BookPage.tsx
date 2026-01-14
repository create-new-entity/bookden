import { useResponsive, useSetTabTitle } from '../../hooks';
import BookPageDesktop from './BookPageDesktop';
import BookPageMobile from './BookPageMobile';


const BookPage = () => {
    const { isDesktop } = useResponsive();

    useSetTabTitle('Book');
    
    return (
        <>
            {
                isDesktop ? <BookPageDesktop /> : <BookPageMobile />
            }
        </>
    );
};

export default BookPage;