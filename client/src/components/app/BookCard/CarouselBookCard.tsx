
import { useMemo } from 'react';
import {
    Box, useTheme,
    type SxProps, type Theme
} from '@mui/material';

import { getPublicBookCover } from '../../../api';
import { useBlobImage, useResponsive } from '../../../hooks';
import type { Book } from '../../../types';
import { BORDER_RADIUS, PLACE_HOLDER_BOOK_COVER } from '../../../constants';
import { Link } from 'react-router-dom';
import { BOOK_COVER_HEIGHT, BOOK_COVER_WIDTH } from './BookCardDesktop';

type Styles = {
    bannerWrapper: SxProps<Theme>;
    bannerImage: SxProps<Theme>
};

const getStyles = (_theme: Theme, { isSm, isXs }: { isSm: boolean; isXs: boolean }): Styles => {
    const resolvedBookCoverWidth = isXs ? BOOK_COVER_WIDTH * 0.5 : (isSm ? BOOK_COVER_WIDTH * 0.85 : BOOK_COVER_WIDTH);
    const resolvedBookCoverHeight = isXs ? BOOK_COVER_HEIGHT * 0.5 : (isSm ? BOOK_COVER_HEIGHT * 0.85 : BOOK_COVER_HEIGHT);
    return {
        bannerWrapper: {
            borderRadius: BORDER_RADIUS,
            overflow: 'hidden'
        },
        bannerImage: {
            width: `${resolvedBookCoverWidth}rem`,
            height: `${resolvedBookCoverHeight}rem`,
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

    const blobOptions = useMemo(() => ({
        queryKey: ['bookCover', book.bookId] as const,
        queryFn: () => getPublicBookCover(book.bookId),
        enabled: !!book.bookId,
    }), [book.bookId]);
    const { objectUrl } = useBlobImage(blobOptions);
    const theme = useTheme();
    const { isSm, isXs} = useResponsive();

    const styles = getStyles(theme, { isSm, isXs });

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

