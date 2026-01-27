import React, { useState, useMemo, useEffect, useRef } from "react";

interface ReadMoreLessProps {
  children: string;
  limit?: number;
  fallbackText?: string;
  className?: string;
}

const ReadMoreLess: React.FC<ReadMoreLessProps> = ({
  children,
  limit = 100,
  fallbackText = "No content available.",
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Convert HTML to Plain Text for word counting
  const plainText = useMemo(() => {
    if (!children || typeof children !== "string") return "";
    const div = document.createElement("div");
    div.innerHTML = children;
    return div.textContent?.trim() || div.innerText?.trim() || "";
  }, [children]);

  const isEmptyContent = !plainText || plainText.length === 0;

  // 2. Check if trimming is needed
  const words = plainText.split(/\s+/);
  const needsTrimming = words.length > limit;

  // 3. Prepare the truncated text
  const previewText = words.slice(0, limit).join(" ") + "...";

  // 4. Accordion Logic (Restored & Optimized)
  // This runs whenever we render the full HTML to ensure accordions inside the content work
  useEffect(() => {
    // Only run if we are showing full HTML (either short content or expanded)
    if ((needsTrimming && !isExpanded) || !containerRef.current) return;

    const container = containerRef.current;
    // Scope selection to this specific container to avoid conflicts
    const accordions = container.querySelectorAll<HTMLElement>(".accordion");

    const handleClick = (accordion: HTMLElement) => {
      const answer = accordion.querySelector<HTMLElement>(".accordion-answer");
      if (!answer) return;

      const isOpen = accordion.classList.contains("active");

      // Close all others (Accordion behavior)
      accordions.forEach((acc) => {
        acc.classList.remove("active");
        const otherAnswer = acc.querySelector<HTMLElement>(".accordion-answer");
        if (otherAnswer) otherAnswer.style.display = "none";
      });

      // Toggle current
      if (!isOpen) {
        accordion.classList.add("active");
        answer.style.display = "block";
      }
    };

    // Attach listeners
    accordions.forEach((accordion) => {
      const question = accordion.querySelector<HTMLElement>(
        ".accordion-question",
      );
      if (question) {
        // Remove old listener property if exists to prevent dupes (basic safety)
        question.onclick = () => handleClick(accordion);
      }
    });

    // Cleanup not strictly necessary for onclick replacement, but good practice
    return () => {
      accordions.forEach((accordion) => {
        const question = accordion.querySelector<HTMLElement>(
          ".accordion-question",
        );
        if (question) question.onclick = null;
      });
    };
  }, [children, isExpanded, needsTrimming]);

  if (isEmptyContent) {
    return <div className="text-gray-400 italic text-sm">{fallbackText}</div>;
  }

  return (
    <div
      id="blog-main"
      ref={containerRef}
      className={`text-gray-700 leading-relaxed text-sm ${className}`}
    >
      {/* CASE A: Show Full HTML (Short content OR Expanded) */}
      {!needsTrimming || isExpanded ? (
        <div>
          <span dangerouslySetInnerHTML={{ __html: children }} />

          {needsTrimming && (
            <button
              onClick={() => setIsExpanded(false)}
              className="inline-block ml-1 text-purple-600 font-bold hover:text-purple-700 hover:underline focus:outline-none text-xs uppercase tracking-wide mt-2"
            >
              Show Less
            </button>
          )}
        </div>
      ) : (
        /* CASE B: Show Truncated Plain Text */
        <div>
          <span>{previewText}</span>
          <button
            onClick={() => setIsExpanded(true)}
            className="inline-block ml-1 text-purple-600 font-bold hover:text-purple-700 hover:underline focus:outline-none text-xs uppercase tracking-wide"
          >
            Read More
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadMoreLess;
