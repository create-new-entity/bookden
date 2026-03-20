
import { Box, useTheme, type SxProps, type Theme } from '@mui/material';

import { sxJoin } from '../../../../utility';
import CarouselDotButton from './CarouselDotButton';



type Styles = {
    dotsContainer: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        dotsContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '0.5rem'
        }
    };
};

type DotButtonsProps = {
    scrollSnaps: number[];
    selectedIndex: number;
    scrollTo: (index: number) => void;
    dotsContainerSx?: SxProps<Theme>;
};


const DotButtons = (props: DotButtonsProps) => {
    const { scrollSnaps, selectedIndex, scrollTo, dotsContainerSx } = props;
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <Box sx={sxJoin(styles.dotsContainer, dotsContainerSx)}>
            {scrollSnaps.map((_, index) => (
                <CarouselDotButton
                    key={index}
                    isSelected={index === selectedIndex}
                    onClick={() => scrollTo(index)}
                />
            ))}
        </Box>
    );
};

export default DotButtons;