import { useTheme, useMediaQuery } from '@mui/material';


const useResponsive = () => {
    const theme = useTheme();

    /* 
        only = one slice of the pixel range. (start inclusive, end exclusive)

        Pixel ranges are:
            xs: 0–599px
            sm: 600–899px
            md: 900–1199px
            lg: 1200–1535px
            xl: 1536px+

        So, "only('xs')" will return true if the screen width is between 0 and 599px and so on.
    */
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMd = useMediaQuery(theme.breakpoints.only('md'));
    const isLg = useMediaQuery(theme.breakpoints.only('lg'));
    const isXl = useMediaQuery(theme.breakpoints.only('xl'));

    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // xs + sm
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // sm < md
    const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // md + lg + xl

    return {
        isXs,
        isSm,
        isMd,
        isLg,
        isXl,
        isMobile,
        isTablet,
        isDesktop,
    };
};

export default useResponsive;