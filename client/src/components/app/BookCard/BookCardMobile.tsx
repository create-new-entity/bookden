import { Link } from 'react-router-dom';
import {
    Box, Card, CardMedia,
    Stack, Typography, useTheme,
    type Theme, type SxProps, Chip
} from '@mui/material';

import { getBookCover } from '../../../api';
import { useBlobImage, useResponsive } from '../../../hooks';
import type { Book, BookAction } from '../../../types';
import { DEFAULT_GAP, PLACE_HOLDER_BOOK_COVER } from '../../../constants';
import { useAuthContext } from '../../../contexts';

type Styles = {
    card: SxProps<Theme>;
    cardMedia: SxProps<Theme>;
    dataStack: SxProps<Theme>;
    synopsis: SxProps<Theme>;
    title: SxProps<Theme>;
    author: SxProps<Theme>;
    price: SxProps<Theme>;
    yearPublished: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    const cardHeight = '10rem';
    const smallerFontSize = '0.6rem';
    return {
        card: {
            padding: '0.6rem',
            height: cardHeight,
            '& .MuiIconButton-root': {
                padding: 0
            },
            '& .book-card-actions': {
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 0.15s ease-in-out'
            },
            '&:hover .book-card-actions': {
                opacity: 1,
                pointerEvents: 'auto'
            }
        },
        cardMedia: {
            '& img': {
                width: '7rem',
                height: '7rem',
                objectFit: 'cover'
            },
            [theme.breakpoints.down('sm')]: {
                '& img': {
                    width: '6rem',
                    height: '6rem'
                }
            }
        },
        dataStack: {
            [theme.breakpoints.down('sm')]: {
                width: '60%'
            }
        },
        title: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '23rem'
        },
        author: {
            [theme.breakpoints.down('sm')]: {
                fontSize: smallerFontSize,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '30%',
                height: '2rem'
            }
        },
        price: {
            [theme.breakpoints.down('sm')]: {
                fontSize: smallerFontSize
            }
        },
        yearPublished: {
            [theme.breakpoints.down('sm')]: {
                fontSize: smallerFontSize,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        },
        synopsis: {
            overflow: 'auto',
            height: '5rem'
        }
    };
};

type BookCardMobileProps = {
    item: Book;
    getActions: (book: Book) => BookAction[];
};

const BookCardMobile = (props: BookCardMobileProps) => {
    const { item, getActions } = props;
    const book = item;
    const blobOptions = {
        queryKey: ['bookCover', book.bookId],
        queryFn: () => getBookCover(book.bookId),
        enabled: !!book.bookId,
    };
    const { objectUrl } = useBlobImage(blobOptions);
    const theme = useTheme();
    const { isXs } = useResponsive();

    const { userType, hasExistingLoggedInUser } = useAuthContext();
    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedUserType = existingLoggedInData?.userType || userType;
    const isAdminOrSuperAdmin = resolvedUserType === 'admin' || resolvedUserType === 'superadmin';


    const styles = getStyles(theme);
    const isDeleted = book.deletedAt !== null;

    const actions = getActions(book);
    const resolvedTitleVariant = isXs ? 'body2' : 'body1';

    return (
        <Link to={`/books/${book.bookId}`}>
            <Card
                sx={styles.card}
                data-testid={`book-card-${book.title.toLowerCase().replace(/ /g, '-')}`}
            >
                <Stack
                    direction={'row'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP / 2}px`}
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
                    <Stack
                        direction={'column'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        flexGrow={1}
                        gap={`${DEFAULT_GAP / 4}px`}
                        sx={styles.dataStack}
                    >
                        <Stack
                            direction={'row'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            gap={`${DEFAULT_GAP / 4}px`}
                            alignSelf={'stretch'}
                        >
                            <Typography sx={styles.title} variant={resolvedTitleVariant}>
                                {book.title}
                            </Typography>
                            {
                                <Stack
                                    direction={'row'}
                                    justifyContent={'flex-start'}
                                    alignItems={'center'}
                                    gap={`${DEFAULT_GAP / 4}px`}
                                >
                                    {
                                        isDeleted && isAdminOrSuperAdmin &&
                                        <Chip label='Deleted' color='error' size='small' />
                                    }
                                    <Box className='book-card-actions'>
                                        <Stack
                                            direction={'row'}
                                            justifyContent={'flex-start'}
                                            alignItems={'center'}
                                            gap={`${DEFAULT_GAP / 4}px`}
                                        >
                                            {
                                                actions.map((action) => {
                                                    const { id, onClick, toolTipTitle, IconComponent } = action;
                                                    return (
                                                        <IconComponent
                                                            key={id}
                                                            onClick={onClick}
                                                            tooltipTitle={toolTipTitle}
                                                        />
                                                    );
                                                })
                                            }
                                        </Stack>
                                    </Box>
                                </Stack>
                            }
                        </Stack>
                        <Stack
                            direction={'row'}
                            justifyContent={'flex-start'}
                            alignItems={'center'}
                            gap={`${DEFAULT_GAP / 2}px`}
                        >
                            {
                                book.authors.length > 0
                                    ?
                                    <Typography sx={styles.author} variant='subtitle1'>
                                        By {book.authors.join(', ')}
                                    </Typography>
                                    :
                                    <Typography sx={styles.author} variant='subtitle1'>
                                        By Unknown Author
                                    </Typography>
                            }
                            <Typography sx={styles.yearPublished} variant='body2'>
                                Published in {book.yearPublished}
                            </Typography>
                            <Typography sx={styles.price} variant='body2'>
                                €{book.price}
                            </Typography>
                        </Stack>
                        <Typography sx={styles.synopsis} variant='body2'>
                            {
                                book.synopsis && book.synopsis.length > 0
                                    ? book.synopsis
                                    : 'No synopsis available'
                            }
                        </Typography>
                    </Stack>
                </Stack>
            </Card>
        </Link>
    );
};

export default BookCardMobile;