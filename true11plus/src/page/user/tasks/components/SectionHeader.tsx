import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string; // optional
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="text-left pb-8 relative z-10">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)]">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 text-slate-600 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
