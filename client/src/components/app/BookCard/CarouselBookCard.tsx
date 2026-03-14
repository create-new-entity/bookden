
import {
    Box, useTheme,
    type SxProps, type Theme
} from '@mui/material';

import { getBookCover } from '../../../api';
import { useBlobImage } from '../../../hooks';
import type { Book } from '../../../types';
import { BORDER_RADIUS, PLACE_HOLDER_BOOK_COVER } from '../../../constants';
import { Link } from 'react-router-dom';
import { BOOK_COVER_HEIGHT, BOOK_COVER_WIDTH } from './BookCardDesktop';

type Styles = {
    bannerWrapper: SxProps<Theme>;
    bannerImage: SxProps<Theme>
};

const getStyles = (_theme: Theme): Styles => {
    return {
        bannerWrapper: {
            borderRadius: BORDER_RADIUS,
            overflow: 'hidden'
        },
        bannerImage: {
            width: `${BOOK_COVER_WIDTH}rem`,
            height: `${BOOK_COVER_HEIGHT}rem`,
            objectFit: 'cover',
            display: 'block',
            '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }
        }
    };
};

type CarouselBookCardProps = {
    item: Book;
};

const CarouselBookCard = (props: CarouselBookCardProps) => {
    const { item: book } = props;

    const blobOptions = {
        queryKey: ['bookCover', book.bookId],
        queryFn: () => getBookCover(book.bookId),
        enabled: !!book.bookId,
    };
    const { objectUrl } = useBlobImage(blobOptions);
    const theme = useTheme();

    const styles = getStyles(theme);

    return (
        <Link to={`/books/${book.bookId}`}>
            <Box sx={styles.bannerWrapper}>
                <Box
                    component="img"
                    src={objectUrl || PLACE_HOLDER_BOOK_COVER}
                    alt=""
                    sx={styles.bannerImage}
                />
            </Box>
        </Link>
    );
};

export default CarouselBookCard;

