
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

const universities = [
  "HARVARD", "OXFORD", "CAMBRIDGE", "STANFORD", "MIT", "YALE",
  "PRINCETON", "COLUMBIA", "BERKELEY", "CALTECH"
];

const UniversityLogo = () => {
  return (
    <div className="w-full py-8 backdrop-blur-sx">

      <style>
        {`
          .swiper-wrapper {
            transition-timing-function: linear !important;
          }
        `}
      </style>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={40}
        slidesPerView={2}
        loop={true}
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
            spaceBetween: 60,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 80,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 100,
          },
        }}
        className="pointer-events-none select-none"
      >
        {universities.map((uni, i) => (
          <SwiperSlide key={i}>
            <div className="flex items-center justify-center h-full">
              <span className="text-slate-400 font-serif font-bold text-xl md:text-2xl  hover:text-slate-800 transition-colors duration-300 cursor-default whitespace-nowrap">
                {uni}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UniversityLogo;