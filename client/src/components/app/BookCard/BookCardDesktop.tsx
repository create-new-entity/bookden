
import {
    Box, Card, CardContent, CardMedia,
    Stack, Typography, Tooltip,
    Chip
} from '@mui/material';
import {useTheme,type SxProps,type Theme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';

import type { Book } from '../../../types';
import {
    BOOK_CARD_PADDING, DEFAULT_GAP, ONE_TENTH_OF_DEFAULT_GAP,
    PLACE_HOLDER_BOOK_COVER
} from '../../../constants';
import { useAuthContext } from '../../../contexts';
import { getBookCover } from '../../../api';
import { useBlobImage, useDeleteBook, useRestoreBook } from '../../../hooks';
import BookCardActions from './BookCardActions';



const BOOK_COVER_WIDTH = 17;
const BOOK_COVER_HEIGHT = BOOK_COVER_WIDTH * 1.5;
const BOOK_CARD_HEIGHT = '38rem';


type Styles = {
    card: SxProps<Theme>;
    cardMedia: SxProps<Theme>;
    cardContent: SxProps<Theme>;
    textOverflowEllipsis: SxProps<Theme>;
    actionsStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        actionsStack: {
            position: 'relative',
            top: 0,
            right: 0,
            marginTop: '-0.5rem',
            marginBottom: '0.5rem'
        },
        card: {
            '& .MuiIconButton-root': {
                padding: 0
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


type BookCardDesktopProps = {
    item: Book;
    onItemDelete?: () => void;
    onItemRestore?: () => void;
};

const BookCardDesktop = ({ item, onItemDelete, onItemRestore }: BookCardDesktopProps) => {
    const book = item;
    const blobOptions = {
        queryKey: ['bookCover', book.bookId],
        queryFn: () => getBookCover(book.bookId),
        enabled: !!book.bookId,
    };
    const { objectUrl } = useBlobImage(blobOptions);
    const theme = useTheme();
    const { deleteBookCoverAndBookData } = useDeleteBook(book.bookId);
    const { restoreBookMutation } = useRestoreBook(book.bookId);
    const navigate = useNavigate();

    const { userType, hasExistingLoggedInUser } = useAuthContext();
    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedUserType = existingLoggedInData?.userType || userType;
    const isAdminOrSuperAdmin = resolvedUserType === 'admin' || resolvedUserType === 'superadmin';


    const styles = getStyles(theme);
    const isDeleted = book.deletedAt !== null;

    const handleDeleteBook = async () => {
        onItemDelete?.();
        deleteBookCoverAndBookData();
    };
    
    const onEdit = () => {
        navigate(`/books/${book.bookId}/update`);
    };

    const onDelete = () => {
        handleDeleteBook();
    };

    const onRestore = () => {
        restoreBookMutation.mutate();
        onItemRestore?.();
    };

    return (
        <Link to={`/books/${book.bookId}`}>
            <Card sx={styles.card} data-testid={'book-card'}>
                <Stack
                    sx={styles.actionsStack}
                    direction={'row'}
                    justifyContent={'flex-end'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP / 4}px`}
                >
                    {
                        isDeleted &&
                        <Chip label='Deleted' color='error' size='small' />
                    }
                    <BookCardActions
                        bookId={book.bookId}
                        isDeleted={isDeleted}
                        allowedActions={['edit', 'delete', 'restore']}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onRestore={onRestore}
                    />
                </Stack>
                <Stack
                    direction={'column'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP / 4}px`}
                >
                    <Box sx={styles.cardMedia}>
                        {
                            objectUrl ? 
                                <CardMedia
                                    component='img'
                                    image={objectUrl}
                                />
                                :
                                <CardMedia
                                    component='img'
                                    image={PLACE_HOLDER_BOOK_COVER}
                                />
                        }
                    </Box>
                    <CardContent sx={styles.cardContent}>
                        <Stack
                            direction={'column'}
                            justifyContent={'flex-start'}
                            alignItems={'center'}
                            gap={`${ONE_TENTH_OF_DEFAULT_GAP}px`}
                        >
                            <Tooltip sx={{ alignSelf: 'stretch'}} title={book.title}>
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

export default BookCardDesktop;