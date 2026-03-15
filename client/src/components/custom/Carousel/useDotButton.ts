

import { useCallback, useEffect, useState } from 'react';
import { type EmblaCarouselType } from 'embla-carousel';


type UseDotButtonReturn = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

export const useDotButton = (emblaApi: EmblaCarouselType | undefined): UseDotButtonReturn => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onDotButtonClick = useCallback(
        (index: number) => {
            emblaApi?.scrollTo(index);
        },
        [emblaApi]
    );

    const onInit = useCallback((emblaApi: EmblaCarouselType) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        onInit(emblaApi);
        onSelect(emblaApi);

        emblaApi
            .on('reInit', onInit)


            /*
                Note to future self:
                
                Why onSelect on reInit as well?

                If the carousel is re-initialized, the selected index might change
                (e.g., if the number of slides changes).

                To ensure that the selected index state is updated correctly
                after a re-initialization, we need to call onSelect when the 'reInit' event occurs.

                This way, we can keep our component's state in sync with the carousel's state even after
                it has been re-initialized.
            */
            .on('reInit', onSelect)
            .on('select', onSelect);

        return () => {
            emblaApi.off('reInit', onInit);
            emblaApi.off('reInit', onSelect);
            emblaApi.off('select', onSelect);
        };

    }, [emblaApi, onInit, onSelect]);

    return {
        selectedIndex,
        scrollSnaps,
        onDotButtonClick
    };
};