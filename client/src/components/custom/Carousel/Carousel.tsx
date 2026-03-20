
import { Box, useTheme, type SxProps, type Theme } from '@mui/material';
import type { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

import { useCarouselControls } from './useCarouselControls';
import { sxJoin } from '../../../utility/utility';
import { Arrows } from './CarouselControls';
import DotButtons from './CarouselControls/DotButtons';




type CarouselNavigationMode = 'dots' | 'arrows' | 'both' | 'none';

type Styles = {
    emblaRoot: SxProps<Theme>;
    emblaViewport: SxProps<Theme>;
    emblaContainer: SxProps<Theme>;
    emblaSlide: SxProps<Theme>;
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
        }
    };
};


type CarouselProps<T, P extends object = Record<string, unknown>> = {
    items: T[];
    SlideComponent: React.ComponentType<{ item: T } & P>;
    slideProps?: P;
    getKey: (item: T) => React.Key;
    emblaOptions?: EmblaOptionsType;
    navigationMode?: CarouselNavigationMode;

    // Style override entry points: rootSx, viewportSx, containerSx, slideSx, dotsContainerSx
    rootSx?: SxProps<Theme>;
    viewportSx?: SxProps<Theme>;
    containerSx?: SxProps<Theme>;
    slideSx?: SxProps<Theme>;
    dotsContainerSx?: SxProps<Theme>;
};

const Carousel = <T, P extends object = Record<string, unknown>>(
    props: CarouselProps<T, P>
) => {
    const {
        items, SlideComponent, slideProps,
        getKey, emblaOptions, navigationMode = 'arrows',
        rootSx = {}, viewportSx = {}, containerSx = {}, slideSx = {}, dotsContainerSx = {}
    } = props;

    const theme = useTheme();
    const styles = getStyles(theme);
    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
    const {
        scrollPrev, scrollNext,
        canScrollPrev,canScrollNext,
        scrollSnaps, scrollTo, selectedIndex,
    } = useCarouselControls(emblaApi);

    const showArrows = navigationMode === 'arrows' || navigationMode === 'both';
    const showDots = navigationMode === 'dots' || navigationMode === 'both';

    return (
        <Box sx={sxJoin(styles.emblaRoot, rootSx)} className="embla">
            {
                showArrows &&
                <Arrows
                    scrollPrev={scrollPrev}
                    scrollNext={scrollNext}
                    canScrollPrev={canScrollPrev}
                    canScrollNext={canScrollNext}
                />
            }
            {
                /*
                    Note to future self:

                    "Your markup must follow this pattern:

                    An overflow wrapper (embla__viewport below) that hides overflowing content.
                    A scroll container (embla__container) that holds and scrolls the slides.
                    One or more slides (embla__slide). Embla also supports an empty state with no slides."

                    "The outer .embla wrapper shown in the examples is optional.
                    You can use it as a convenient container for navigation controls or styling,
                    but Embla only requires the viewport → container → slides hierarchy."

                    ---> https://www.embla-carousel.com/docs/guides/required-setup
                */
            }
            <Box sx={sxJoin(styles.emblaViewport, viewportSx)} className="embla__viewport" ref={emblaRef}>
                <Box sx={sxJoin(styles.emblaContainer, containerSx)} className="embla__container">
                    {
                        items.map((item) => (
                            <Box sx={sxJoin(styles.emblaSlide, slideSx)} className="embla__slide" key={getKey(item)}>
                                <SlideComponent item={item} {...(slideProps ?? ({} as P))} />
                            </Box>
                        ))
                    }
                </Box>
            </Box>
            {
                showDots &&
                <DotButtons
                    scrollSnaps={scrollSnaps}
                    selectedIndex={selectedIndex}
                    scrollTo={scrollTo}
                    dotsContainerSx={dotsContainerSx}
                />
            }
        </Box>
    );
};

export default Carousel;