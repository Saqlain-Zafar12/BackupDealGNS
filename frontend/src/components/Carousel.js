import React from 'react';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const watches = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1530745342582-0795f23ec976?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Apple Watch with black fabric band and colorful watch face"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Apple Watch with black rubber band showing app grid"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1711700357997-7dd71318d2bd?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Apple Watch with black fabric band and colorful watch face"
  },
];

const NextArrow = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <button
      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full z-10"
      onClick={onClick}
      aria-label={t('carousel.nextSlide')}
    >
      <FaChevronRight className="h-6 w-6" />
    </button>
  );
};

const PrevArrow = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <button
      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full z-10"
      onClick={onClick}
      aria-label={t('carousel.previousSlide')}
    >
      <FaChevronLeft className="h-6 w-6" />
    </button>
  );
};

export default function Carousel() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    rtl: isRTL,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: function(i) {
      return (
        <button
          className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors duration-300"
          aria-label={t('carousel.goToSlide', { number: i + 1 })}
        />
      );
    },
  };

  return (
    <div className="relative w-full h-[20vh] sm:h-[50vh] overflow-hidden bg-black">
      <Slider {...settings}>
        {watches.map((watch) => (
          <div key={watch.id} className="w-full h-[30vh] sm:h-[50vh]">
            <img
              src={watch.src}
              alt={watch.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}