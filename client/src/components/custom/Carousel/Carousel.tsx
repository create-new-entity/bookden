
import { Box, useTheme, type SxProps, type Theme } from '@mui/material';
import { type EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

import { useDotButton } from './useDotButton';
import CarouselDotButton from './CarouselDotButton';



type Styles = {
    emblaRoot: SxProps<Theme>;
    emblaViewport: SxProps<Theme>;
    emblaContainer: SxProps<Theme>;
    emblaSlide: SxProps<Theme>;
    dotsContainer: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        emblaRoot: {
            /*
                Current thought: Having this position as relative gives flexibility in terms of
                how we want to position controls ( like dot buttons ) in future.
            */
            position: 'relative'
        },
        emblaViewport: {
            overflow: 'hidden'
        },
        emblaContainer: {
            display: 'flex'
        },
        emblaSlide: {
            /*
                flex: '0 0 auto'is
                same as:
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto'



                Means:
                    do not grow
                    do not shrink
                    size comes from slide content

                More explanation:

                    Browser must decide:

                        How wide each slide should be
                        Whether slides should grow
                        Whether slides should shrink
                        That’s where the three flex properties come in.

                    More details: https://chatgpt.com/share/69b54e94-4afc-8012-adb2-27b7d5d2c481


                ** WIP: Slide component will control width. Idea is to fix the dimension via props or something. **
            */
            flex: '0 0 auto'
        },
        dotsContainer: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '0.5rem'
        }
    };
};


type CarouselProps<T, P extends object = Record<string, unknown>> = {
    items: T[];
    SlideComponent: React.ComponentType<{ item: T } & P>;
    slideProps?: P;
    getKey: (item: T) => React.Key;
    emblaOptions?: EmblaOptionsType;
};

const Carousel = <T, P extends object = Record<string, unknown>>(
    props: CarouselProps<T, P>
) => {
    const {
        items, SlideComponent, slideProps, getKey, emblaOptions
    } = props;

    const theme = useTheme();
    const styles = getStyles(theme);
    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    return (
        <Box sx={styles.emblaRoot} className="embla">
            <Box sx={styles.emblaViewport} className="embla__viewport" ref={emblaRef}>
                <Box sx={styles.emblaContainer} className="embla__container">
                    {
                        items.map((item) => (
                            <Box sx={styles.emblaSlide} className="embla__slide" key={getKey(item)}>
                                <SlideComponent item={item} {...(slideProps ?? ({} as P))} />
                            </Box>
                        ))
                    }
                </Box>
            </Box>
            <Box sx={styles.dotsContainer}>
                {scrollSnaps.map((_, index) => (
                    <CarouselDotButton
                        key={index}
                        isSelected={index === selectedIndex}
                        onClick={() => onDotButtonClick(index)}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default Carousel;