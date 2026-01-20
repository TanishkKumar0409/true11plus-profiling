import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItemData {
  question: string;
  answer: string;
}

interface FAQItemProps {
  item: FAQItemData;
}

const FAQItem = ({ item }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        type="button"
        className="w-full py-5 cursor-pointer flex items-center justify-between text-left focus:outline-none group"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-slate-800 font-semibold group-hover:text-amber-600 transition-colors">
          {item.question}
        </span>

        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-amber-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-40 opacity-100 mb-6" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-slate-600 text-sm leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
};

export default FAQItem;
