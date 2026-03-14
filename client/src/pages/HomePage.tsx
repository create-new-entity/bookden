
import { Divider, Stack, useTheme, type SxProps, type Theme } from '@mui/material';

import { BooksCarousel, HeroBannerCarousel } from '../components';
import { useHomePageBookLists, useSetTabTitle } from '../hooks';

type Styles = {
    rootStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            padding: '4.5rem'
        }
    };
};

const HomePage = () => {

    useSetTabTitle('Home');
    const theme = useTheme();
    const styles = getStyles(theme);
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