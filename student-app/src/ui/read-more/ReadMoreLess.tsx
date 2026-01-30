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

  const needsTrimming = useMemo(() => {
    if (!children || typeof children !== "string") return false;
    const div = document.createElement("div");
    div.innerHTML = children;
    const text = div.textContent?.trim() || div.innerText?.trim() || "";
    const wordCount = text.split(/\s+/).length;
    return wordCount > limit;
  }, [children, limit]);

  const isEmptyContent = !children || children.length === 0;

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
    return <div className="text-gray-400 italic text-sm">{fallbackText}</div>;
  }

  const contentStyle: React.CSSProperties = isExpanded
    ? {}
    : {
        display: "-webkit-box",
        WebkitLineClamp: Math.ceil(limit / 10),
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      };

  return (
    <div
      id="blog-main"
      className={`text-gray-700 leading-relaxed text-sm ${className}`}
    >
      <div
        ref={containerRef}
        style={needsTrimming ? contentStyle : {}}
        className="relative"
      >
        <span dangerouslySetInnerHTML={{ __html: children }} />
      </div>

      {needsTrimming && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-block mt-2 text-purple-600 font-bold hover:text-purple-700 hover:underline focus:outline-none text-xs uppercase tracking-wide"
        >
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default ReadMoreLess;
