
import type { EmblaCarouselType } from 'embla-carousel';
import { useCallback, useEffect, useState } from 'react';



export const useCarouselControls = (emblaApi: EmblaCarouselType | undefined) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollTo = useCallback((index: number) => {
        if (!emblaApi) {
            return;
        };
        emblaApi.scrollTo(index);
    }, [emblaApi]);

    const scrollPrev = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.scrollNext();
    }, [emblaApi]);

    const updateState = useCallback((api: EmblaCarouselType) => {
        setSelectedIndex(api.selectedScrollSnap());
        setScrollSnaps(api.scrollSnapList());
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        updateState(emblaApi);

        emblaApi.on('select', updateState);
        emblaApi.on('reInit', updateState);

        return () => {
            emblaApi.off('select', updateState);
            emblaApi.off('reInit', updateState);
        };
    }, [emblaApi, updateState]);

    return {
        selectedIndex, scrollSnaps,
        canScrollPrev, canScrollNext,
        scrollTo, scrollPrev, scrollNext
    };
};