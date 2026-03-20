
import {
    Divider, Stack, Typography,
    useTheme, type SxProps, type Theme
} from '@mui/material';
import { Link } from 'react-router-dom';

import { BooksCarousel, HeroBannerCarousel } from '../components';
import { useHomePageBookLists, useResponsive, useSetTabTitle } from '../hooks';
import { BOOKS } from '../constants';

type Styles = {
    rootStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme, { isXs }: { isXs: boolean }): Styles => {
    const resolvedPadding = isXs ? '1rem' : '4.5rem';
    return {
        rootStack: {
            padding: resolvedPadding,
        }
    };
};

const GapBetWeenCarousels = '2.5rem';

const HomePage = () => {

    useSetTabTitle('Home');
    const theme = useTheme();
    const { isXs } = useResponsive();
    const styles = getStyles(theme, { isXs });
    const { data } = useHomePageBookLists();

    const bookLists = data?.bookLists || [];

    return (
        <>
            <Stack
                direction={'column'}
                justifyContent={'flex-start'}
                alignItems={'center'}
                sx={styles.rootStack}
                gap={GapBetWeenCarousels}
            >
                <Stack
                    direction={'column'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={'0.5rem'}
                >
                    <Typography variant='h4'>
                        Welcome to BookDen 📚
                    </Typography>
                    <Stack
                        direction={'row'}
                        justifyContent={'flex-start'}
                        alignItems={'center'}
                        gap={'0.2rem'}
                    >
                        <Typography>
                            You can browse our full catalog
                        </Typography>
                        <Link to={BOOKS}>
                            <Typography color='info'>
                                here.
                            </Typography>
                        </Link>
                    </Stack>
                </Stack>
                <HeroBannerCarousel/>
                <Divider sx={{ width: '100%' }} />
                {
                    bookLists.map((bookList) => {
                        return (
                            <BooksCarousel
                                key={bookList.key}
                                title={bookList.title}
                                books={bookList.books}
                            />
                        );
                    })
                }
            </Stack>
        </>
    );
};

export default HomePage;