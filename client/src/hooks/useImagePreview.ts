import { useEffect, useState } from 'react';

import { PLACE_HOLDER_BOOK_COVER } from '../constants';


type UseImagePreviewArgs = {
    initialImageUrl?: string;
};


type UseImagePreviewReturn = {
  file: File | null;
  objectUrl: string;
  setFile: (file: File | null) => void;
  clearImageFile: () => void;
};

export const useImagePreview = (args?: UseImagePreviewArgs): UseImagePreviewReturn => {
    const { initialImageUrl = PLACE_HOLDER_BOOK_COVER } = args || {};

    const [file, setFile] = useState<File | null>(null);
    const [objectUrl, setObjectUrl] = useState<string>(initialImageUrl);

    useEffect(() => {
        if (!file) {
            setObjectUrl(initialImageUrl);
            return;
        }

        const url = URL.createObjectURL(file);
        setObjectUrl(url);

        return () => {
            // Note to future self: Important! Clean up the object URL when the component unmounts.
            URL.revokeObjectURL(url); 
        };
    }, [file, initialImageUrl]);

    const clearImageFile = () => {
        setFile(null);
    };

    return { file, objectUrl, setFile, clearImageFile };
};
