import { useEffect, useState } from 'react';

import { PLACE_HOLDER_BOOK_COVER } from '../constants';


type UseImagePreviewArgs = {
    initialImageUrl?: string;
    placeholderImageUrl: string;
};


type UseImagePreviewReturn = {
  file: File | null;
  objectUrl: string;
  setFile: (file: File | null) => void;
  clearImageFile: () => void;
};

/* 
    Responsibility of useImagePreview hook is
    to take care of the image preview logic and image file handling locally.
    It doesn't make any API calls.

    It is agnostic of what the image is about ( book or user ).

    A placeholder image must be provided as fallback.

    If there is no initial image url provided, the placeholder image will be used.

    The use case of "initial image" is: Update a book cover or update a user avatar. 
    In that case user / book already has an image.
*/

export const useImagePreview = (args: UseImagePreviewArgs): UseImagePreviewReturn => {
    const { initialImageUrl, placeholderImageUrl } = args;
    const initialObjectUrl = initialImageUrl ?? placeholderImageUrl;

    const [file, setFile] = useState<File | null>(null);
    const [isCleared, setIsCleared] = useState(false);
    const [objectUrl, setObjectUrl] = useState(initialObjectUrl);
    

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setObjectUrl(url);

            // Note to future self: Important! Clean up the object URL when the component unmounts.
            return () => URL.revokeObjectURL(url);
        }

        if (isCleared) {
            setObjectUrl(placeholderImageUrl);
            return;
        }

        setObjectUrl(initialObjectUrl);
    }, [file, isCleared, initialObjectUrl, placeholderImageUrl]);

    const clearImageFile = () => {
        setFile(null);
        setIsCleared(true);
    };
    

    return { file, objectUrl, setFile, clearImageFile };
};
