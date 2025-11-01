import AuthenticationTabs from '../components/AuthenticationTabs';
import { colors } from '../theme/theme';
import { Box } from '@mui/material';

const styles: Record<string, React.CSSProperties> = {
    rootContainer : {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.paperYellow,
        height: '100vh',
    },
    imageContainer: {
        width: '50%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: colors.paperYellow
    },
    image: {
        maxWidth: '90%',
        height: 'auto',
        display: 'block',
        objectFit: 'cover',
        padding: '0.2rem',
        borderRadius: '2rem'
    },
};


const LogInPage = () => {
    
    return (
        <Box sx={styles.rootContainer}>
            <Box sx={styles.imageContainer}>
                <img
                    style={styles.image}
                    src="/assets/bookden_illustration.png"
                    alt="Books background"
                    className="w-full h-auto object-cover"
                />
            </Box>
            <AuthenticationTabs/>
        </Box>
    );
};

export default LogInPage;