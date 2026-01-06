
import { useResponsive } from '../../hooks';
import BookPageDesktop from './BookPageDesktop';
import BookPageMobile from './BookPageMobile';


const BookPage = () => {
    const { isDesktop } = useResponsive();
    
    return (
        <>
            {
                isDesktop ? <BookPageDesktop /> : <BookPageMobile />
            }
        </>
    );
};

export default BookPage;