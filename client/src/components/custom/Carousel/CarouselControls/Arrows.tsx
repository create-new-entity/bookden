import { Box, type SxProps, type Theme, useTheme } from '@mui/material';

import CarouselArrowButton from './CarouselArrowButton';
import { sxJoin } from '../../../../utility';


const ARROW_MARGIN = '0.5rem';

type Styles = {
    arrowButton: SxProps<Theme>;
    leftArrowButton: SxProps<Theme>;
    rightArrowButton: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        arrowButton: {
            position: 'absolute',
            top: '45%',
            transform: 'translateY(-50%)',
            zIndex: 1
        },
        leftArrowButton: {
            left: ARROW_MARGIN
        },
        rightArrowButton: {
            right: ARROW_MARGIN
        },
    };
};


type ArrowsProps = {
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
};

const Arrows = (props: ArrowsProps) => {
    const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = props;
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <>
            <Box sx={sxJoin(styles.arrowButton, styles.leftArrowButton)}>
                <CarouselArrowButton
                    direction="prev"
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                />
            </Box>
            <Box sx={sxJoin(styles.arrowButton, styles.rightArrowButton)}>
                <CarouselArrowButton
                    direction="next"
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                />
            </Box>
        </>
    );
};

export default Arrows;