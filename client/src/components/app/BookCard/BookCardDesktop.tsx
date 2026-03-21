
import {
    Box, Card, CardContent, CardMedia,
    Stack, Typography, Tooltip, Chip
} from '@mui/material';
import {useTheme,type SxProps,type Theme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import type { Book, BookAction } from '../../../types';
import {
    BOOK_CARD_PADDING, DEFAULT_GAP, ONE_TENTH_OF_DEFAULT_GAP, PLACE_HOLDER_BOOK_COVER
} from '../../../constants';
import { type UseAdminBookCoverHook, type UsePublicBookCoverHook } from '../../../hooks';



export const BOOK_COVER_WIDTH = 17;
export const BOOK_COVER_HEIGHT = BOOK_COVER_WIDTH * 1.5;
const BOOK_CARD_HEIGHT = '38rem';


type Styles = {
    card: SxProps<Theme>;
    cardMedia: SxProps<Theme>;
    cardContent: SxProps<Theme>;
    textOverflowEllipsis: SxProps<Theme>;
    actionsStack: SxProps<Theme>;
    actionsContainer: SxProps<Theme>;
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
            minWidth: `${BOOK_COVER_WIDTH + BOOK_CARD_PADDING * 2}rem`,
            // default (not hovered)
            '& .book-card-actions': {
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 0.15s ease-in-out'
            },

            // hovered
            '&:hover .book-card-actions': {
                opacity: 1,
                pointerEvents: 'auto'
            }
        },
        actionsContainer: {
            height: '2rem'
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
    getActions: (book: Book) => BookAction[];
    useBookCover: UsePublicBookCoverHook | UseAdminBookCoverHook;
};

const BookCardDesktop = ({ item, getActions, useBookCover }: BookCardDesktopProps) => {
    const book = item;
    const { bookCoverBlob } = useBookCover(book.bookId);
    const theme = useTheme();
    const actions = getActions(book);

    const styles = getStyles(theme);
    const isDeleted = book.deletedAt !== null;

    

    return (
        <Link to={`/books/${book.bookId}`} data-testid={`book-card-${book.title.toLowerCase().replace(/ /g, '-')}`}>
            <Card sx={styles.card}>
                <Box sx={styles.actionsContainer}>
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
                        <Box className='book-card-actions'>
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
                        </Box>
                    </Stack>
                </Box>
                <Stack
                    direction={'column'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP / 4}px`}
                >
                    <Box sx={styles.cardMedia}>
                        {
                            bookCoverBlob.objectUrl ? 
                                <CardMedia
                                    component='img'
                                    image={bookCoverBlob.objectUrl}
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