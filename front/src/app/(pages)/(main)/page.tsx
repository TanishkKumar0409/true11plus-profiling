import HeroSection from "./_home_components/HeroSection";
import StickyCarouselSection from "./_home_components/StickyCarouselSection";
import MentorSection from "./_home_components/MentorSection";
import StudentSuccessSection from "./_home_components/StudentSuccessSection";
import TestimonialSection from "./_home_components/TestimonialsSection";
import FAQSection from "./_home_components/FaqSection";

const Home = async () => {
  return (
    <div className="flex flex-col min-h-screen bg-(bg-main) text-(--text-main)">
      <HeroSection />
      <StickyCarouselSection />
      <MentorSection />
      <StudentSuccessSection />
      <TestimonialSection />
      <FAQSection />
    </div>
  );
};

export default Home;
