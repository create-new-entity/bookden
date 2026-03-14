


import HeroBannerSlide from './HeroBannerSlide';
import { heroBanners, type HeroBanner } from '../../../data/heroBanners';
import { Carousel } from '../../custom';

const HeroBannerCarousel = () => {
    return (
        <Carousel
            items={heroBanners}
            SlideComponent={HeroBannerSlide}
            getKey={(banner: HeroBanner) => banner.id}
            emblaOptions={{
                loop: true
            }}
        />
    );
};

export default HeroBannerCarousel;