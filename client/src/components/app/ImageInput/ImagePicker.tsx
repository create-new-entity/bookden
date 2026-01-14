import { type RefObject } from 'react';

import { IMAGE_MIME_TYPES } from '../../../constants';

type ImagePickerProps = {
  onSelect: (file: File) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

const ImagePicker = ({ onSelect, inputRef }: ImagePickerProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        onSelect(files[0]);

        // allow re-selecting the same file
        event.target.value = '';
    };

    return (
        <input
            ref={inputRef}
            type="file"
            hidden
            accept={IMAGE_MIME_TYPES.join(', ')}
            onChange={handleChange}
        />
    );
};

ImagePicker.displayName = 'ImagePicker';

export default ImagePicker;
