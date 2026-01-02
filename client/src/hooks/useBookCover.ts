
import { getBookCover } from '../api/books';
import useBlobImage from './useBlobImage';


const useBookCover = (bookId: number) => {
    const blobOptions = {
        queryKey: ['bookCover', bookId],
        queryFn: () => getBookCover(bookId),
        enabled: !!bookId,
    };
    
    return useBlobImage(blobOptions);
};

export default useBookCover;