import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import type { Swiper as SwiperType } from "swiper";

type Props = {
  images: string[];
};

const ImageCarousel = ({ images }: Props) => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (!swiperRef.current) return;
    if (!prevRef.current || !nextRef.current) return;

    const swiper = swiperRef.current;

    if (
      typeof swiper.params.navigation !== "boolean" &&
      swiper.params.navigation
    ) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;

      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative group overflow-hidden rounded-custom">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={10}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="w-full h-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`slide-${index}`}
              className="w-full aspect-square object-cover max-h-125"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        ref={prevRef}
        type="button"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-(--main-subtle) hover:bg-(--main) text-(--main) hover:text-(--white) flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-10 shadow-custom"
        aria-label="Previous slide"
      >
        <BiChevronLeft className="w-6 h-6" />
      </button>

      <button
        ref={nextRef}
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-(--main-subtle) hover:bg-(--main) text-(--main) hover:text-(--white) flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-10 shadow-custom"
        aria-label="Next slide"
      >
        <BiChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ImageCarousel;
