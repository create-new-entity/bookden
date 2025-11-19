import { Box, useMediaQuery, useTheme } from '@mui/material';

import { AuthenticationTabs } from '../components';
import { useThemeModeContext } from '../contexts';
import { useEffect } from 'react';

const styles: Record<string, React.CSSProperties> = {
    rootContainer : {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100vh',
    },
    imageContainer: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    image: {
        maxWidth: '80%',
        height: 'auto',
        display: 'block',
        objectFit: 'cover',
        padding: '0.2rem',
        borderRadius: '2rem'
    },
    bookdenLogo: {
        height: '5rem'
    }
};


const LogInPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { isLightMode } = useThemeModeContext();

    useEffect(() => {
        document.title = 'Authentication';
    }, []);
    
    return (
        <Box sx={styles.rootContainer}>
            {
                !isMobile &&
                <Box sx={styles.imageContainer}>
                    <Box sx={styles.bookdenLogo}>
                        <img
                            src={ isLightMode ? '/assets/book-den-black.svg' : '/assets/book-den-white.svg' }
                            alt='Book Den Logo'
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </Box>
                    <img
                        style={styles.image}
                        src='/assets/bookden_illustration.png'
                        alt='Books background'
                        className='w-full h-auto object-cover'
                    />
                </Box>
            }
            <AuthenticationTabs/>
        </Box>
    );
};

export default LogInPage;