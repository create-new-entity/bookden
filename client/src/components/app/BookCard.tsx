

import {
    Box, Card, CardContent,
    CardMedia, Stack, Typography, Tooltip
} from '@mui/material';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import type { Book } from '../../types';
import { useBlobImage } from '../../hooks';
import {
    BOOK_CARD_PADDING, DEFAULT_GAP, ONE_TENTH_OF_DEFAULT_GAP
} from '../../constants';
import { useAuthContext, useNotificationContext } from '../../contexts';
import { getBookCover } from '../../api';



const BOOK_COVER_WIDTH = 17;
const BOOK_COVER_HEIGHT = BOOK_COVER_WIDTH * 1.5;
const BOOK_CARD_HEIGHT = '38rem';


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
            padding: `${BOOK_CARD_PADDING}rem`,
            height: BOOK_CARD_HEIGHT,
            minWidth: `${BOOK_COVER_WIDTH + BOOK_CARD_PADDING * 2}rem`
        },
        cardMedia: {
            '& img': {
                width: `${BOOK_COVER_WIDTH}rem`,
                height: `${BOOK_COVER_HEIGHT}rem`,
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
                            gap={`${ONE_TENTH_OF_DEFAULT_GAP}px`}
                        >
                            <Tooltip title={book.title}>
                                <Typography variant='h6' sx={styles.textOverflowEllipsis}>
                                    {book.title}
                                </Typography>
                            </Tooltip>
                            <Tooltip title={book.authors.join(', ')}>
                                {
                                    book.authors.length > 0
                                        ?
                                        <Typography variant='subtitle1' sx={styles.textOverflowEllipsis}>
                                            By {book.authors.join(', ')}
                                        </Typography>
                                        :
                                        <Typography variant='subtitle1' sx={styles.textOverflowEllipsis}>
                                            By Unknown Author
                                        </Typography>
                                }
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
                            <Typography>
                                Published in {book.yearPublished}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Stack>
            </Card>
        </Link>
    );
};

export default BookCard;