"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { trueTestimonials } from "@/common/TestimonialsData";
import Heading from "@/ui/heading/Heading";
import { BiCheckCircle } from "react-icons/bi";
import { BsQuote } from "react-icons/bs";
import { LuStar } from "react-icons/lu";
import Image from "next/image";

export default function TestimonialSection() {
  return (
    <section className="relative sm:px-8 px-4 py-24 bg-linear-to-b to-(--primary-bg) from-(--secondary-bg) overflow-hidden">
      <div className="mb-10 text-center">
        <Heading
          badgeText="Testimonials"
          badgeIcon={BiCheckCircle}
          titleNormal="Voices of"
          titleHighlight="Success"
        />
      </div>

      <div className="py-10">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={32}
          slidesPerView={"auto"}
          loop={true}
          speed={5000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          allowTouchMove={true}
          className="testimonial-swiper items-stretch!"
          breakpoints={{
            320: {
              slidesPerView: 1,
              centeredSlides: true,
            },
            768: {
              slidesPerView: "auto",
              centeredSlides: false,
            },
          }}
        >
          {trueTestimonials.map((item, idx) => (
            <SwiperSlide key={idx} className="w-fit! h-auto!">
              <div className="w-[320px] md:w-113 p-8 rounded-custom bg-(--primary-bg) border border-(--primary-bg) shadow-custom group hover:border-(--main) transition-all duration-300 h-full flex flex-col">
                <div className="grow">
                  <div className="flex justify-between items-start mb-6">
                    <BsQuote
                      className="text-(--main) opacity-20 group-hover:opacity-100 transition-opacity"
                      size={40}
                    />
                    <div className="flex gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <LuStar
                          key={i}
                          size={14}
                          className="text-(--warning) fill-(--warning)!"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-(--text-subtle) text-md mb-8 whitespace-normal font-semibold leading-relaxed">
                    &quot;{item?.content}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-(--border) pt-6 mt-auto">
                  <div className="w-14 h-14 rounded-custom object-cover border-2 border-(--main) relative">
                    <Image
                      fill
                      src={item.img}
                      alt={item.name}
                      className="rounded-custom"
                    />
                  </div>
                  <div className="text-left">
                    <h5 className="text-(--text-color) font-bold flex items-center gap-2">
                      {item.name}
                      <BiCheckCircle size={14} className="text-(--main)" />
                    </h5>
                    <p className="text-(--main) text-xs font-bold uppercase tracking-wider">
                      {item?.school}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
