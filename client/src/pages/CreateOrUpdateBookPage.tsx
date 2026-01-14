import { useRef } from 'react';
import {
    Container, Stack, useTheme,
    type SxProps, type Theme
} from '@mui/material';

import { useCreateBook, useImagePreview, useSetTabTitle } from '../hooks';
import {
    BOOK_COVER_HEIGHT, BOOK_COVER_WIDTH, MARGIN_TOP_TO_AVOID_NAV_BAR,
    PLACE_HOLDER_BOOK_COVER
} from '../constants';
import { CreateBookForm, ImageInput } from '../components/app';
import { type CreateUpdateBookData } from '../validations';
import { resolveRequiredImageFile } from '../utility';


type Styles = {
    rootContainer: SxProps<Theme>;
    avatar: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootContainer: {
            marginTop: MARGIN_TOP_TO_AVOID_NAV_BAR
        },
        avatar: {
            width: `${BOOK_COVER_WIDTH}px`,
            height: `${BOOK_COVER_HEIGHT}px`
        }
    };
};


type CreateOrUpdateBookPageProps = {
    mode: 'create' | 'update';
};

const CreateOrUpdateBookPage = (props: CreateOrUpdateBookPageProps) => {
    const { file, objectUrl, setFile, clearImageFile } = useImagePreview();
    const inputRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();
    const { createBookMutation } = useCreateBook();

    const { mode } = props;
    const styles = getStyles(theme);

    const tabTitle = `${mode === 'create' ? 'Create' : 'Update'} Book`;

    useSetTabTitle(tabTitle);

    const onSubmit = async (data: CreateUpdateBookData) => {
        const coverImage = await resolveRequiredImageFile(file);
        createBookMutation.mutate({
            data,
            coverImage
        });
    };

    return (
        <Container sx={styles.rootContainer}>
            <Stack
                direction={'column'}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <ImageInput
                    inputRef={inputRef}
                    onSelectImagePicked={setFile}
                    avatarStyles={styles.avatar}
                    objectUrl={objectUrl}
                    alt={'Book Cover'}
                    defaultPlaceholderImageUrl={PLACE_HOLDER_BOOK_COVER}
                    clearImageFile={clearImageFile}
                />
                {
                    mode === 'create' && <CreateBookForm onSubmit={onSubmit} />
                }
            </Stack>
        </Container>
    );
};

export default CreateOrUpdateBookPage;