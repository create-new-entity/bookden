

import { Box, IconButton, Tooltip, useTheme, type SxProps, type Theme } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useResponsive } from '../../../../hooks';


type Styles = {
    arrowButtonWrapper: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    return {
        arrowButtonWrapper: {
            borderRadius: '50%',
            backgroundColor: theme.palette.background.paper
        }
    };
};


type CarouselArrowButtonProps = {
    direction: 'prev' | 'next';
    onClick: () => void;
    disabled?: boolean;
};

const CarouselArrowButton = ({
    direction,
    onClick,
    disabled
}: CarouselArrowButtonProps) => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const { isMobile } = useResponsive();
    const iconSize = isMobile ? 'small' : 'medium';

    return (
        <Tooltip title={direction === 'prev' ? 'Previous' : 'Next'}>
            <Box sx={styles.arrowButtonWrapper}>
                <IconButton onClick={onClick} disabled={disabled}>
                    {direction === 'prev' ? <ArrowBackIosNewIcon fontSize={iconSize} /> : <ArrowForwardIosIcon fontSize={iconSize} />}
                </IconButton>
            </Box>
        </Tooltip>
    );
};

export default CarouselArrowButton;