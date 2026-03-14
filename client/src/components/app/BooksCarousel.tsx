

import { Paper, Typography, useTheme, type SxProps, type Theme } from '@mui/material';

import type { Book, CarouselBookList } from '../../types';
import { Carousel } from '../custom';
import { CarouselBookCard } from './BookCard';



type Styles = {
    rootPaper: SxProps<Theme>;
    carouselTitle: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    return {
        rootPaper: {
            padding: '1rem',
            width: '100%',
        },
        carouselTitle: {
            maxWidth: 'fit-content',
            padding: '0.5rem',
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.warning.light,
            borderRadius: '0.5rem'
        }
    };
};

const BooksCarousal = (props: CarouselBookList) => {
    const { title, books } = props;

    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <Paper sx={styles.rootPaper}>
            <Typography variant='h6' sx={styles.carouselTitle}>
                {title}
            </Typography>
            <Carousel
                items={books}
                SlideComponent={CarouselBookCard}
                getKey={(book: Book) => book.bookId}
                emblaOptions={{
                    loop: true
                }}
            />
        </Paper>
    );
};

export default BooksCarousal;