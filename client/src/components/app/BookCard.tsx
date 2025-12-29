

import { Box, Card, CardContent, CardMedia, Stack, Typography, Tooltip } from '@mui/material';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import type { Book } from '../../types';
import { useBlobImage } from '../../hooks';
import { BOOK_CARD_PADDING, DEFAULT_GAP } from '../../constants';
import { useAuthContext, useNotificationContext } from '../../contexts';
import { getBookCover } from '../../api';

const BASE_DIMENSION = 15;
const BOOK_COVER_WIDTH = `${BASE_DIMENSION}rem`;
const BOOK_COVER_HEIGHT = `${BASE_DIMENSION * 1.3}rem`;


type Styles = {
    card: SxProps<Theme>;
    cardMedia: SxProps<Theme>;
    cardContent: SxProps<Theme>;
    textOverflowEllipsis: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        card: {
            '& .MuiIconButton-root': {
                display: 'none',
                padding: 0
            },
            '&:not(:hover) .MuiIconButton-root': {
                display: 'none'
            },
            '&:hover .MuiIconButton-root': {
                display: 'block'
            },
            padding: BOOK_CARD_PADDING
        },
        cardMedia: {
            '& img': {
                width: BOOK_COVER_WIDTH,
                height: BOOK_COVER_HEIGHT,
                objectFit: 'cover'
            }
        },
        cardContent: {
            width: '100%',
        },
        textOverflowEllipsis: {
            maxWidth: '80%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }
    };
};


type BookCardProps = {
    item: Book;
    onItemDelete?: () => void;
};

const BookCard = ({ item, onItemDelete }: BookCardProps) => {
    const book = item;
    const { token } = useAuthContext();
    const blobOptions = {
        queryKey: ['bookCover', book.bookId],
        queryFn: () => getBookCover(book.bookId),
        enabled: !!book.bookId,
    };
    const { objectUrl } = useBlobImage(blobOptions);
    const { handleShowNotification } = useNotificationContext();
    const theme = useTheme();


    const styles = getStyles(theme);
    const isAlreadyDeleted = book.deletedAt !== null;

    const handleDeleteBook = async () => {
        // await deleteBook(token, book.bookId);
        onItemDelete?.();
        handleShowNotification('Book deleted successfully.');
    };

    return (
        <Link to={`/books/${book.bookId}`}>
            <Card sx={styles.card} data-testid={'book-card'}>
                <Stack
                    direction={'column'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP}px`}
                >
                    {
                        objectUrl ? 
                            <Box sx={styles.cardMedia}>
                                <CardMedia
                                    component='img'
                                    image={objectUrl}
                                />
                            </Box>
                            :
                            <CardMedia
                                sx={styles.cardMedia}
                                component='img'
                            />
                    }
                    <CardContent sx={styles.cardContent}>
                        <Stack
                            direction={'column'}
                            justifyContent={'flex-start'}
                            alignItems={'center'}
                            gap={`${DEFAULT_GAP/2}px`}
                        >
                            <Tooltip title={book.title}>
                                <Typography variant='h6' sx={styles.textOverflowEllipsis}>
                                    {book.title}
                                </Typography>
                            </Tooltip>
                            <Tooltip title={book.authors.join(', ')}>
                                <Typography variant='body1' sx={styles.textOverflowEllipsis}>
                                    {book.authors.join(', ')}
                                </Typography>
                            </Tooltip>
                            {/* <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>  
                                {
                                    book.deletedAt &&
                                    <Chip label='Deleted' color='error' size='small' />
                                }
                            </Stack> */}
                            <Tooltip title={`€${book.price}`}>
                                <Typography variant='body1' sx={styles.textOverflowEllipsis}>
                                    €{book.price}
                                </Typography>
                            </Tooltip>
                        </Stack>
                    </CardContent>
                </Stack>
            </Card>
        </Link>
    );
};

export default BookCard;