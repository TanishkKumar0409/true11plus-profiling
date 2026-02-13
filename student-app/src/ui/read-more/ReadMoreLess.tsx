import React, { useState, useMemo, useEffect, useRef } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

interface ReadMoreLessProps {
  children: string;
  limit?: number;
  maxHeight?: number;
  fallbackText?: string;
  className?: string;
  readText?: string;
  collapseText?: string;
}

const ReadMoreLess: React.FC<ReadMoreLessProps> = ({
  children,
  limit = 100,
  maxHeight = 150,
  fallbackText = "No content available.",
  className = "",
  readText = "Read Full Details",
  collapseText = "Collapse Details",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const needsTrimming = useMemo(() => {
    if (!children || typeof children !== "string") return false;
    const div = document.createElement("div");
    div.innerHTML = children;
    const text = div.textContent?.trim() || div.innerText?.trim() || "";
    const wordCount = text.split(/\s+/).length;
    return wordCount > limit;
  }, [children, limit]);

  const isEmptyContent = !children || children.length === 0;

  // Maintains existing accordion functionality within the HTML string
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const accordions = container.querySelectorAll<HTMLElement>(".accordion");

    const handleClick = (accordion: HTMLElement) => {
      const answer = accordion.querySelector<HTMLElement>(".accordion-answer");
      if (!answer) return;

      const isOpen = accordion.classList.contains("active");

      accordions.forEach((acc) => {
        acc.classList.remove("active");
        const otherAnswer = acc.querySelector<HTMLElement>(".accordion-answer");
        if (otherAnswer) otherAnswer.style.display = "none";
      });

      if (!isOpen) {
        accordion.classList.add("active");
        answer.style.display = "block";
      }
    };

    accordions.forEach((accordion) => {
      const question = accordion.querySelector<HTMLElement>(
        ".accordion-question",
      );
      if (question) {
        question.onclick = () => handleClick(accordion);
      }
    });

    return () => {
      accordions.forEach((accordion) => {
        const question = accordion.querySelector<HTMLElement>(
          ".accordion-question",
        );
        if (question) question.onclick = null;
      });
    };
  }, [children]);

  if (isEmptyContent) {
    return (
      <div className="text-(--text-color) italic text-sm">{fallbackText}</div>
    );
  }

  return (
    <div
      id="blog-main"
      className={`text-gray-700 leading-relaxed text-sm ${className}`}
    >
      <div
        className="relative overflow-hidden transition-all duration-700 ease-in-out"
        style={{
          maxHeight: needsTrimming
            ? isExpanded
              ? "5000px"
              : `${maxHeight}px`
            : "none",
        }}
      >
        <div ref={containerRef} className="relative">
          <span dangerouslySetInnerHTML={{ __html: children }} />
        </div>

        {/* Gradient Fade effect when collapsed */}
        {needsTrimming && !isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-(--white) via-(--white)/90 to-transparent pointer-events-none" />
        )}
      </div>

      {needsTrimming && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-(--main) hover:opacity-80 transition focus:outline-none"
        >
          {isExpanded ? collapseText : readText}
          {isExpanded ? (
            <BiChevronUp size={14} className="transition-transform" />
          ) : (
            <BiChevronDown size={14} className="transition-transform" />
          )}
        </button>
      )}
    </div>
  );
};

export default ReadMoreLess;
