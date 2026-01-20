import { useEffect, useRef, useState } from "react";
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
        { replace: true }
      );
    }
  }, [activeTab, paramKey, searchParams, setSearchParams]);

  const handleScrollCheck = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
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
      { replace: false }
    );
  };

  if (!visibleTabs.length) return null;

  return (
    // Added min-w-0 here to prevent page overflow
    <div className={`w-full min-w-0 space-y-6 ${className}`}>
      <div className="relative w-full bg-white border border-gray-200 rounded-lg shadow-sm group overflow-hidden">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 w-10 bg-gradient-to-r from-white via-white to-transparent flex items-center justify-center text-gray-500 hover:text-purple-600 transition-colors"
          >
            <BiChevronLeft size={24} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={handleScrollCheck}
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1.5 px-2 w-full scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {visibleTabs.map((tab) => {
            const isActive = activeTabValue === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleTabClick(tab.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 select-none ${
                  isActive
                    ? "bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {tab.icon && <span className="text-lg">{tab.icon}</span>}
                {tab.label}
              </button>
            );
          })}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-20 w-10 bg-gradient-to-l from-white via-white to-transparent flex items-center justify-center text-gray-500 hover:text-purple-600 transition-colors"
          >
            <BiChevronRight size={24} />
          </button>
        )}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab?.component}
      </div>
    </div>
  );
}