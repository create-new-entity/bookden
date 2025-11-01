import AuthenticationTabs from '../components/AuthenticationTabs';
import { customColors } from '../theme/colors';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const styles: Record<string, React.CSSProperties> = {
    rootContainer : {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: customColors.paperYellow,
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
    
    return (
        <Box sx={styles.rootContainer}>
            {
                !isMobile &&
                <Box sx={styles.imageContainer}>
                    <Box sx={styles.bookdenLogo}>
                        <img
                            src="/assets/book-den.svg"
                            alt="Book Den Logo"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </Box>
                    <img
                        style={styles.image}
                        src="/assets/bookden_illustration.png"
                        alt="Books background"
                        className="w-full h-auto object-cover"
                    />
                </Box>
            }
            <AuthenticationTabs/>
        </Box>
    );
};

export default LogInPage;