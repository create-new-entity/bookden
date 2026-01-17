import {
    Container, Stack, useTheme,
    type SxProps, type Theme
} from '@mui/material';


import {
    BOOK_COVER_HEIGHT, BOOK_COVER_WIDTH, MARGIN_TOP_TO_AVOID_NAV_BAR,
    PLACE_HOLDER_BOOK_COVER
} from '../../constants';
import { ImageInput } from '../../components/app';


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


type BookEditorLayoutProps = {
    children: React.ReactNode;
    imageProps: {
      inputRef: React.RefObject<HTMLInputElement | null>;
      objectUrl: string;
      selectFile: (file: File) => void;
      clearImageFile: () => void;
    };
};

const BookEditorLayout = (props: BookEditorLayoutProps) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    const { children, imageProps } = props;
    const { inputRef, objectUrl, selectFile, clearImageFile } = imageProps;
    

    return (
        <Container sx={styles.rootContainer}>
            <Stack
                direction={'column'}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <ImageInput
                    inputRef={inputRef}
                    onSelectImagePicked={selectFile}
                    avatarStyles={styles.avatar}
                    objectUrl={objectUrl}
                    alt={'Book Cover'}
                    defaultPlaceholderImageUrl={PLACE_HOLDER_BOOK_COVER}
                    clearImageFile={clearImageFile}
                />
                {children}
            </Stack>
        </Container>
    );
};

export default BookEditorLayout;