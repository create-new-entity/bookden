
import {
    Container, Stack, useTheme,
    type CSSProperties, type SxProps, type Theme
} from '@mui/material';


type Styles = {
    rootContainer: SxProps<Theme>;
    rootStack: SxProps<Theme>;
    image: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootContainer: {
            width: '100%',
            height: '100vh'
        },
        rootStack: {
            width: '100%',
            height: '100%'
        },
        image: {
            width: '50%',
            height: 'auto',
            borderRadius: '1rem'
        }
    };
};

const UnauthorizedPage = () => {
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <Container sx={styles.rootContainer}>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={styles.rootStack}
            >
                <img
                    src={'/assets/images/errors/403_Unauthorized.png'}
                    alt="Unauthorized"
                    style={styles.image as CSSProperties}
                />
            </Stack>
        </Container>
    );
};

export default UnauthorizedPage;