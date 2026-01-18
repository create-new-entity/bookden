import { Link } from 'react-router-dom';
import {
    Box, Card, CardMedia,
    Stack, Typography, useTheme,
    type Theme, type SxProps
} from '@mui/material';

import { getBookCover } from '../../../api';
import { useBlobImage } from '../../../hooks';
import type { Book } from '../../../types';
import { DEFAULT_GAP } from '../../../constants';

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
            height: cardHeight
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
            [theme.breakpoints.down('sm')]: {
                fontSize: '1rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '90%'
            }
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
                fontSize: smallerFontSize,
                // overflow: 'hidden',
                // textOverflow: 'ellipsis',
                // flexGrow: 1
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
            height: '4rem'
        }
    };
};

type BookCardMobileProps = {
    item: Book;
};

const BookCardMobile = (props: BookCardMobileProps) => {
    const { item } = props;
    const book = item;
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
            <Card sx={styles.card}>
                <Stack
                    direction={'row'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP / 2}px`}
                >
                    <Box sx={styles.cardMedia}>
                        <CardMedia
                            component='img'
                            image={objectUrl}
                            alt={book.title}
                        />
                    </Box>
                    <Stack
                        direction={'column'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        gap={`${DEFAULT_GAP / 4}px`}
                        sx={styles.dataStack}
                    >
                        <Typography sx={styles.title} variant='h6'>
                            {book.title}
                        </Typography>
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