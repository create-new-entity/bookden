

import { Paper, Typography, useTheme, type SxProps, type Theme } from '@mui/material';

import type { Book, CarouselBookList } from '../../types';
import { Carousel } from '../custom';
import { CarouselBookCard } from './BookCard';
import { useResponsive } from '../../hooks';



type Styles = {
    rootPaper: SxProps<Theme>;
    carouselTitle: SxProps<Theme>;
    carouselTitlePaper: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    const mode = theme.palette.mode;

    /*
        Note to future self:

        Don't use palette.info here. It is not meant to be used
        as background color.
        
        Refactor and change to some other prop later.
    */
    const resolvedBackgroundColor = mode === 'light' ? theme.palette.info.light : theme.palette.info.dark;

    
    return {
        rootPaper: {
            padding: '1rem',
            width: '100%',
        },
        carouselTitlePaper: {
            maxWidth: 'fit-content'
        },
        carouselTitle: {
            maxWidth: 'fit-content',
            padding: '0.5rem',
            color: theme.palette.text.primary,
            backgroundColor: resolvedBackgroundColor,
            borderRadius: '0.5rem',
            marginBottom: '1rem'
        }
    };
};

const BooksCarousal = (props: CarouselBookList) => {
    const { title, books } = props;

    const theme = useTheme();
    const { isXs } = useResponsive();
    const styles = getStyles(theme);

    const resolvedVariant = isXs ? 'subtitle2' : 'h6';

    return (
        <Paper sx={styles.rootPaper}>
            <Paper sx={styles.carouselTitlePaper} elevation={2}>
                <Typography variant={resolvedVariant} sx={styles.carouselTitle}>
                    {title}
                </Typography>
            </Paper>
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