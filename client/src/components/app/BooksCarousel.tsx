

import { Paper, Typography, useTheme, type SxProps, type Theme } from '@mui/material';

import type { Book, CarouselBookList } from '../../types';
import { Carousel } from '../custom';
import { CarouselBookCard } from './BookCard';



type Styles = {
    rootPaper: SxProps<Theme>;
    carouselTitle: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    const mode = theme.palette.mode;
    const resolvedBackgroundColor = mode === 'light' ? theme.palette.secondary.light : theme.palette.secondary.dark;
    return {
        rootPaper: {
            padding: '1rem'
        },
        carouselTitle: {
            maxWidth: 'fit-content',
            padding: '0.5rem',
            backgroundColor: resolvedBackgroundColor,
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