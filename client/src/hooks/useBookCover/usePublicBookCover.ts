


import { getPublicBookCover } from '../../api/books';
import { useBlobImage, type UseBlobImageReturn } from '../useBlobImage';


export type UsePublicBookCoverReturn = {
    bookCoverBlob: UseBlobImageReturn;
};
export type UsePublicBookCoverHook = (bookId: number) => UsePublicBookCoverReturn;

export const usePublicBookCover: UsePublicBookCoverHook = (bookId) => {

    const blobOptions = {
        queryKey: ['bookCover', bookId],
        queryFn: () => {
            return getPublicBookCover(bookId);
        },
        enabled: !!bookId,
    };
    
    return {
        bookCoverBlob: useBlobImage(blobOptions)
    };
};
