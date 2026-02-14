import React from "react";
import HeroSkeleton from "../components/landing/HeroSkeleton";
import StickyStackLoader from "../components/landing/StickyStackLoader";
import MentorSkeleton from "../components/landing/MentorSkeleton";
import StudentSkeleton from "../components/landing/StudentSkeleton";
import TestimonialsSkeleton from "../components/landing/TestimonialSkeleton";
import FaqsSkeleton from "../components/landing/FaqSkeleton";

export default function LandingPageSkeleton() {
  return (
    <div>
      <HeroSkeleton />
      <StickyStackLoader />
      <MentorSkeleton />
      <StudentSkeleton />
      <TestimonialsSkeleton />
      <FaqsSkeleton />
    </div>
  );
}
