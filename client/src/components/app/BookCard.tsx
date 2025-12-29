

import { Box, Card, CardContent, CardMedia, Stack, Typography, Chip, IconButton } from '@mui/material';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

import type { Book } from '../../types';
import { useBlobImage } from '../../hooks';
import { BORDER_RADIUS, DEFAULT_GAP } from '../../constants';
import { useAuthContext, useNotificationContext } from '../../contexts';
import { deleteBook, getBookCover } from '../../api';


type Styles = {
    rootStack: SxProps<Theme>;
    card: SxProps<Theme>;
    cardMedia: SxProps<Theme>;
    cardContent: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    const rootStackPaddingLeft = '10px';
    const rootStacDefaultGap = `${DEFAULT_GAP}px`;
    const IMAGE_WIDTH_HEIGHT = '100px';

    return {
        card: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '& .MuiIconButton-root': {
                display: 'none',
                padding: 0
            },
            '&:not(:hover) .MuiIconButton-root': {
                display: 'none'
            },
            '&:hover .MuiIconButton-root': {
                display: 'block'
            }
        },
        rootStack: {
            paddingLeft: '10px',
            height: '100%'
        },
        cardMedia: {
            width: IMAGE_WIDTH_HEIGHT,
            height: IMAGE_WIDTH_HEIGHT,
            borderRadius: BORDER_RADIUS,
            '& img': {
                width: IMAGE_WIDTH_HEIGHT,
                height: IMAGE_WIDTH_HEIGHT,
                objectFit: 'cover'
            }
        },
        cardContent: {
            flex: 1,
            maxWidth: `calc(100% - ${IMAGE_WIDTH_HEIGHT} - ${rootStackPaddingLeft} - ${rootStacDefaultGap})`,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0
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
                <Stack sx={styles.rootStack} direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>
                    {
                        objectUrl ? 
                            <Box sx={styles.cardMedia}>
                                <CardMedia
                                    sx={styles.cardMedia}
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
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Typography variant='h6'>{book.title}</Typography>
                            {
                                !isAlreadyDeleted &&
                                <IconButton onClick={handleDeleteBook}><DeleteIcon /></IconButton>
                            }
                        </Stack>
                        <Typography variant='body1'>{book.authors.join(', ')}</Typography>
                        <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>  
                            {
                                book.deletedAt &&
                                <Chip label='Deleted' color='error' size='small' />
                            }
                        </Stack>
                        <Typography variant='body1'>{book.createdAt}</Typography>
                    </CardContent>
                </Stack>
            </Card>
        </Link>
    );
};

export default BookCard;