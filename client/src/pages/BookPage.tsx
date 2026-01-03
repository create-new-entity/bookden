import {
    Button, Container, Divider, Paper,
    Stack, Typography, useTheme, type SxProps, type Theme
} from '@mui/material';
import { useParams } from 'react-router-dom';

import { useBook, useBookCover } from '../hooks';
import { DEFAULT_BORDER_RADIUS, DEFAULT_GAP, MARGIN_TOP_TO_AVOID_NAV_BAR } from '../constants';

const BOOK_COVER_WIDTH = 20;
const BOOK_COVER_HEIGHT = BOOK_COVER_WIDTH * 1.5;

type Styles = {
    rootStack: SxProps<Theme>;
    bookCoverContainer: SxProps<Theme>;
    bookDetailsContainer: SxProps<Theme>;
    synopsisContainer: SxProps<Theme>;
    synopsisDivider: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            marginTop: MARGIN_TOP_TO_AVOID_NAV_BAR
        },
        bookCoverContainer: {
            width: `${BOOK_COVER_WIDTH}rem`,
            minWidth: `${BOOK_COVER_WIDTH}rem`,
            height: `${BOOK_COVER_HEIGHT}rem`
        },
        bookDetailsContainer: {
            padding: `${DEFAULT_GAP}px`,
            width: '100%',
            height: '100%'
        },
        synopsisContainer: {
            padding: `${DEFAULT_GAP}px`
        },
        synopsisDivider: {
            margin: `${DEFAULT_GAP}px 0`
        }
    };
};


const BookPage = () => {
    const { bookId } = useParams();
    const theme = useTheme();
    const styles = getStyles(theme);
    const bookQuery = useBook(parseInt(bookId || '-1', 10));
    const { objectUrl } = useBookCover(bookQuery.data?.bookId || -1);
    
    return (
        <Container>
            <Stack
                sx={styles.rootStack}
                direction={'column'}
                justifyContent={'flex-start'}
                alignItems={'stretch'}
                gap={`${DEFAULT_GAP}px`}
            >
                <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP}px`}
                >
                    <Stack
                        direction={'row'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        gap={`${DEFAULT_GAP}px`}
                        flexGrow={1}
                    >
                        <Paper
                            elevation={5}
                            sx={styles.bookCoverContainer}
                        >
                            <img src={objectUrl} alt='Book Cover' style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: DEFAULT_BORDER_RADIUS }} />
                        </Paper>
                        <Stack
                            direction={'column'}
                            justifyContent={'center'}
                            alignItems={'flex-end'}
                            gap={`${DEFAULT_GAP}px`}
                            flexGrow={1}
                            alignSelf={'stretch'}
                        >
                            <Stack
                                direction={'row'}
                                justifyContent={'flex-start'}
                                alignItems={'center'}
                                gap={`${DEFAULT_GAP}px`}
                            >
                                <Typography variant='h4' color='info'>
                                    €{bookQuery.data?.price}
                                </Typography>
                                <Button variant='contained' color='primary'>
                                    Add to cart
                                </Button>
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
                                    <Typography variant='h4' fontWeight={'bold'}>
                                        {bookQuery.data?.title}
                                    </Typography>
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
                                </Stack>
                            </Paper>
                        </Stack>
                    </Stack>
                </Stack>
                <Paper elevation={5} sx={styles.synopsisContainer}>
                    <Stack>
                        <Typography variant='h5' fontWeight={'bold'}>
                            Synopsis:
                        </Typography>
                        <Divider sx={styles.synopsisDivider}/>
                        <Typography variant='body1'>
                            {bookQuery.data?.synopsis}
                        </Typography>
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
};

export default BookPage;