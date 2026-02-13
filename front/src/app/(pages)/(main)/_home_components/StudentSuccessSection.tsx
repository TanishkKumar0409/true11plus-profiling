"use client";

import { motion } from "framer-motion";
import Heading from "@/ui/heading/Heading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { BiCheckCircle, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { Button } from "@/ui/button/Button";
import { FaExternalLinkAlt } from "react-icons/fa";
import { UserProps } from "@/types/UserProps";
import { getUserAvatar } from "@/contexts/Callbacks";

export default function StudentSuccessSection({
  students,
}: {
  students: UserProps[];
}) {
  return (
    <section className="relative py-24 sm:px-8 px-4 bg-(--primary-bg) overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <Heading
            badgeText="7,733+ Success Stories"
            badgeIcon={BiCheckCircle}
            titleNormal="Where Dreams Meet"
            titleHighlight="Destiny"
          />

          <div className="hidden md:flex gap-3 mb-2">
            <button
              className="swiper-button-prev-custom group cursor-pointer w-12 h-12 rounded-full border border-(--border) flex items-center justify-center hover:bg-(--main) hover:border-(--main) transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <BiChevronLeft
                size={24}
                className="text-(--text-color) group-hover:text-(--white) transition-colors"
              />
            </button>

            <button
              className="swiper-button-next-custom group cursor-pointer w-12 h-12 rounded-full border border-(--border) flex items-center justify-center hover:bg-(--main) hover:border-(--main) transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <BiChevronRight
                size={24}
                className="text-(--text-color) group-hover:text-(--white) transition-colors"
              />
            </button>
          </div>
        </div>

        <div className="pb-20">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {students?.map((student, index) => (
              <SwiperSlide key={index} className="h-full">
                <StudentCard student={student} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-custom bg-linear-to-br from-(--main) to-(--main-emphasis) text-(--white) flex flex-col md:flex-row items-center justify-between gap-8 shadow-custom relative overflow-hidden"
        >
          <div className="lg:flex items-center gap-6 relative z-10">
            <div className="flex -space-x-3 mb-3 sm:mb-0">
              {students?.slice(0, 5)?.map((ite, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-(--border) bg-(--main-emphasis) overflow-hidden shadow-custom"
                >
                  <img
                    src={getUserAvatar(ite?.avatar || [])}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">
                "I want to be the next success story"
              </p>
              <p className="text-(--white) text-sm font-medium">
                Join the global True11Plus community
              </p>
            </div>
          </div>

          <Button
            label="Apply Now"
            variant="secondary"
            icon={<FaExternalLinkAlt size={14} />}
            className="text-(--white)! hover:text-(--main)!"
          />
        </motion.div>
      </div>
    </section>
  );
}

function StudentCard({ student }: { student: UserProps }) {
  const bannerUrl = student.banner?.[0]
    ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${student.banner[0]}`
    : null;

  return (
    <div className="group h-full bg-(--secondary-bg) rounded-custom transition-all duration-500 flex flex-col overflow-hidden shadow-custom">
      <div className="aspect-2/1 w-full bg-linear-to-br from-(--main) to-(--main-emphasis)  overflow-hidden relative">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-(--main) to-(--main-emphasis) opacity-20" />
        )}
      </div>

      <div className="px-5 pb-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 -mt-8 mb-4 relative z-10">
          <div className="w-16 h-16 rounded-custom overflow-hidden border-2 border-(--secondary-bg) shadow-custom bg-(--primary-bg) shrink-0">
            <img
              src={getUserAvatar(student?.avatar || [])}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="pt-8 min-w-0">
            <h3 className="text-base font-bold text-(--text-color) truncate leading-tight">
              {student.name}
            </h3>
            <p className="text-xs text-(--main) font-medium truncate">
              @{student.username}
            </p>
          </div>
        </div>

        <div className="min-h-18 mb-6">
          {student.about ? (
            <p className="text-(--text-color) opacity-70 text-sm leading-relaxed line-clamp-3 italic">
              "{student.about}"
            </p>
          ) : (
            <div className="h-full w-full" />
          )}
        </div>

        <div className="mt-auto">
          <Button href={`/profile/${student.username}`} label="View Profile" />
        </div>
      </div>
    </div>
  );
}
