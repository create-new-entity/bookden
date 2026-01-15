import {
    Button, Container, Paper,
    Stack, Typography, useTheme,
    type SxProps, type Theme
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { useBook, useBookCover } from '../../hooks';
import { DEFAULT_BORDER_RADIUS, DEFAULT_GAP, MARGIN_TOP_TO_AVOID_NAV_BAR } from '../../constants';
import { BOOK_COVER_HEIGHT_MOBILE, BOOK_COVER_WIDTH_MOBILE } from './constants';
import { useAuthContext } from '../../contexts';
import { canBuyBook, canEditBook } from '../../utility';
import EditActionButton from '../../components/app/ActionButtons/EditActionButton';


type Styles = {
    rootStack: SxProps<Theme>;
    bookTitle: SxProps<Theme>;
    bookCoverContainer: SxProps<Theme>;
    bookDetailsContainer: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            marginTop: `calc(${MARGIN_TOP_TO_AVOID_NAV_BAR} / 2)`
        },
        bookTitle: {
            overflow: 'hidden',
            overflowX: 'scroll',
            whiteSpace: 'nowrap',
            marginLeft: '1rem',
            marginRight: '1rem'
        },
        bookCoverContainer: {
            width: `${BOOK_COVER_WIDTH_MOBILE}rem`,
            height: `${BOOK_COVER_HEIGHT_MOBILE}rem`,
        },
        bookDetailsContainer: {
            padding: `${DEFAULT_GAP}px`,
            width: '100%',
            height: '26rem',
            overflowY: 'auto'
        },
    };
};


const BookPageMobile = () => {
    const { userType } = useAuthContext();
    const { bookId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const styles = getStyles(theme);
    const bookQuery = useBook(parseInt(bookId || '-1', 10));
    const { objectUrl } = useBookCover(bookQuery.data?.bookId || -1);
    const showEditBookButton = canEditBook(userType);
    const showAddToCartButton = canBuyBook(userType);

    const handleEditBook = () => {
        navigate(`/books/${bookId}/update`);
    };

    return (
        <Container>
            <Stack
                direction={'column'}
                justifyContent={'flex-start'}
                alignItems={'center'}
                gap={`${DEFAULT_GAP / 2}px`}
                sx={styles.rootStack}
            >
                <Paper
                    elevation={5}
                    sx={styles.bookCoverContainer}
                >
                    <img src={objectUrl} alt='Book Cover' style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: DEFAULT_BORDER_RADIUS }} />
                </Paper>
                <Typography variant='body1' sx={styles.bookTitle}>
                    {bookQuery.data?.title} by {bookQuery.data?.authors?.join(', ')}
                </Typography>
                <Stack
                    direction={'row'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP}px`}
                >
                    <Typography variant='h4' color='info'>
                        €{bookQuery.data?.price}
                    </Typography>
                    {
                        showAddToCartButton && (
                            <Button variant='contained' color='primary'>
                                Add to cart
                            </Button>
                        )
                    }
                    {
                        showEditBookButton && (
                            <EditActionButton
                                onClick={handleEditBook}
                                tooltipTitle='Edit Book'
                            />
                        )
                    }
                </Stack>
                <Paper
                    elevation={5}
                    sx={styles.bookDetailsContainer}
                >
                    <Stack
                        direction={'column'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        gap={`${DEFAULT_GAP}px`}
                    >
                        <Typography variant='body1'>
                            By {bookQuery.data?.authors?.join(', ')}
                        </Typography>
                        <Typography>
                            ISBN: {bookQuery.data?.isbn}
                        </Typography>
                        <Typography>
                            Published in: {bookQuery.data?.yearPublished}
                        </Typography>
                        <Typography>
                            Pages: {bookQuery.data?.pages}
                        </Typography>
                        <Typography>
                            Language: {bookQuery.data?.language}
                        </Typography>
                        <Typography>
                            Tags: {bookQuery.data?.tags?.join(', ')}
                        </Typography>
                        <Typography variant='h5' fontWeight={'bold'}>
                            Synopsis:
                        </Typography>
                        <Typography variant='body1'>
                            {bookQuery.data?.synopsis}
                        </Typography>
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
};

export default BookPageMobile;