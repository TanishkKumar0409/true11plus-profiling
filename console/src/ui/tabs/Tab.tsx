import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export interface TabItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  component: React.ReactNode;
  hide?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  paramKey?: string;
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTab,
  paramKey = "tab",
  className = "",
}: TabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const visibleTabs = tabs.filter((tab) => !tab.hide);

  const activeTabValue =
    searchParams.get(paramKey) || defaultTab || visibleTabs[0]?.value;

  const activeTab =
    visibleTabs.find((t) => t.value === activeTabValue) || visibleTabs[0];

  useEffect(() => {
    if (!searchParams.get(paramKey) && activeTab) {
      setSearchParams(
        (prev) => {
          prev.set(paramKey, activeTab.value);
          return prev;
        },
        { replace: true },
      );
    }
  }, [activeTab, paramKey, searchParams, setSearchParams]);

  const handleScrollCheck = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 1);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    handleScrollCheck();
    window.addEventListener("resize", handleScrollCheck);
    return () => window.removeEventListener("resize", handleScrollCheck);
  }, [visibleTabs]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleTabClick = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.set(paramKey, value);
        return prev;
      },
      { replace: false },
    );
  };

  if (!visibleTabs.length) return null;

  return (
    // Added min-w-0 here to prevent page overflow
    <div className={`w-full min-w-0 mt-6 ${className}`}>
      <div className="relative w-full border-b border-(--border) mb-4">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-30 w-10 bg-linear-to-r from-(--white) via-(--white) to-transparent flex items-center justify-center text-(--text-color) hover:text-(--main) transition-colors"
          >
            <BiChevronLeft size={24} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScrollCheck}
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide px-2 w-full scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {visibleTabs.map((tab) => {
            const isActive = activeTabValue === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleTabClick(tab.value)}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap select-none ${
                  isActive
                    ? "text-(--main)"
                    : "text-(--text-color) hover:text-(--text-color-emphasis)"
                }`}
              >
                {tab.icon && <span className="text-lg">{tab.icon}</span>}
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--main) z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-30 w-10 bg-linear-to-l from-(--white) via-(--white) to-transparent flex items-center justify-center text-(--text-color) hover:text-(--main) transition-colors"
          >
            <BiChevronRight size={24} />
          </button>
        )}
      </div>
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTabValue}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeTab?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
