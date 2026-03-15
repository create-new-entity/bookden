
import { Divider, Stack, useTheme, type SxProps, type Theme } from '@mui/material';

import { BooksCarousel, HeroBannerCarousel } from '../components';
import { useHomePageBookLists, useResponsive, useSetTabTitle } from '../hooks';

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
                gap={'4.5rem'}
            >
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