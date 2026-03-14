
import { Stack, useTheme, type SxProps, type Theme } from '@mui/material';
import { HeroBannerCarousel } from '../components';
import { useHomePageBookLists, useSetTabTitle } from '../hooks';

type Styles = {
    rootStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            padding: '2rem'
        }
    };
};

const HomePage = () => {

    useSetTabTitle('Home');
    const theme = useTheme();
    const styles = getStyles(theme);
    const bookLists = useHomePageBookLists();

    // console.log('bookLists', bookLists.data);

    return (
        <>
            <Stack
                direction={'column'}
                justifyContent={'flex-start'}
                alignItems={'center'}
                sx={styles.rootStack}
            >
                <HeroBannerCarousel/>
            </Stack>
        </>
    );
};

export default HomePage;