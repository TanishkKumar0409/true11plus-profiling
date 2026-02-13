"use client";

import { API } from "@/contexts/API";
import { getErrorResponse } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import { useCallback, useEffect, useState } from "react";
import HeroSection from "./_home_components/HeroSection";
import StickyCarouselSection from "./_home_components/StickyCarouselSection";
import MentorSection from "./_home_components/MentorSection";
import StudentSuccessSection from "./_home_components/StudentSuccessSection";
import TestimonialSection from "./_home_components/TestimonialsSection";
import FAQSection from "./_home_components/FaqSection";

const Home = () => {
  const [suggestions, setSuggestions] = useState<UserProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const getSuggestions = useCallback(async () => {
    try {
      const response = await API.get(`/user/random/students?limit=8`);
      setSuggestions(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getSuggestions();
  }, [getSuggestions]);

  if (isLoading) return <>Users Loading...</>;

  return (
    <div className="flex flex-col min-h-screen bg-(bg-main) text-(--text-main)">
      <HeroSection />
      <StickyCarouselSection />
      <MentorSection />
      <StudentSuccessSection students={suggestions} />
      <TestimonialSection />
      <FAQSection students={suggestions} />
    </div>
  );
};

export default Home;
