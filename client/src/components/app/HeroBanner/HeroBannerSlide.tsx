

import {
    Box, useTheme,
    type SxProps, type Theme
} from '@mui/material';

import type { HeroBanner } from '../../../data/heroBanners';
import { BORDER_RADIUS } from '../../../constants';
import { useResponsive } from '../../../hooks';



type Styles = {
    bannerWrapper: SxProps<Theme>;
    bannerImage: SxProps<Theme>
};

const BANNER_IMAGE_HEIGHT = 350;
const SMALLER_BANNER_IMAGE_HEIGHT = 250;
const SMALLEST_BANNER_IMAGE_HEIGHT = 150;

const getStyles = (_theme: Theme, isSm: boolean, isXs: boolean): Styles => {
    const resolvedBannerHeight = isXs ? SMALLEST_BANNER_IMAGE_HEIGHT : (isSm ? SMALLER_BANNER_IMAGE_HEIGHT : BANNER_IMAGE_HEIGHT);
    return {
        bannerWrapper: {
            borderRadius: BORDER_RADIUS,
            overflow: 'hidden'
        },
        bannerImage: {
            width: '100%',
            height: resolvedBannerHeight,
            objectFit: 'cover',
            display: 'block'
        }
    };
};

type Props = {
  item: HeroBanner;
};

const HeroBannerSlide = ({ item }: Props) => {
    const theme = useTheme();
    const { isSm, isXs } = useResponsive();

    const styles = getStyles(theme, isSm, isXs);
    return (
        <Box sx={styles.bannerWrapper}>
            <Box
                component="img"
                src={item.image}
                alt=""
                sx={styles.bannerImage}
            />
        </Box>
    );
};

export default HeroBannerSlide;