
import {
    useTheme, type CSSProperties, type SxProps, type Theme
} from '@mui/material';

import ErrorWrapper from './ErrorWraper';


type Styles = {
    image: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
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
        <ErrorWrapper>
            <img
                src={'/assets/images/errors/403_Unauthorized.png'}
                alt="Unauthorized"
                style={styles.image as CSSProperties}
            />
        </ErrorWrapper>
    );
};

export default UnauthorizedPage;