

import { useEffect, useState } from 'react';

import { PLACE_HOLDER_BOOK_COVER } from '../constants';



type UseImagePreviewReturn = {
  file: File | null;
  objectUrl: string;
  setFile: (file: File | null) => void;
  clearImageFile: () => void;
};

export const useImagePreview = (): UseImagePreviewReturn => {
    const [file, setFile] = useState<File | null>(null);
    const [objectUrl, setObjectUrl] = useState<string>(PLACE_HOLDER_BOOK_COVER);

    useEffect(() => {
        if (!file) {
            setObjectUrl(PLACE_HOLDER_BOOK_COVER);
            return;
        }

        const url = URL.createObjectURL(file);
        setObjectUrl(url);

        return () => {
            // Note to future self: Important! Clean up the object URL when the component unmounts.
            URL.revokeObjectURL(url); 
        };
    }, [file]);

    const clearImageFile = () => {
        setFile(null);
    };

    return { file, objectUrl, setFile, clearImageFile };
};
