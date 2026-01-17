


import {
    Button, Container, Stack,
    Tooltip, Typography, useTheme,
    type SxProps, type Theme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

import { HOME } from '../../constants';


type Styles = {
    rootContainer: SxProps<Theme>;
    rootStack: SxProps<Theme>;
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
        }
    };
};

const ErrorWrapper = ({ children }: { children: React.ReactNode }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const styles = getStyles(theme);

    return (
        <Container sx={styles.rootContainer}>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={styles.rootStack}
                gap={'0.5rem'}
            >
                <Tooltip title="Go to home">
                    <Button variant="contained" onClick={() => navigate(HOME)}>
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            gap={'0.2rem'}
                        >
                            <HomeIcon />
                            <Typography variant="body1">Home</Typography>
                        </Stack>
                    </Button>
                </Tooltip>
                {children}
            </Stack>
        </Container>
    );
};

export default ErrorWrapper;