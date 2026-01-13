
import { getBookCover } from '../api/books';
import { useBlobImage } from './useBlobImage';


export const useBookCover = (bookId: number) => {
    const blobOptions = {
        queryKey: ['bookCover', bookId],
        queryFn: () => getBookCover(bookId),
        enabled: !!bookId,
    };
    
    return useBlobImage(blobOptions);
};
