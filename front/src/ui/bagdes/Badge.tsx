const Badge = ({ text = "PROGRAM 2025", className = "" }) => {
  return (
    <div
      className={`inline-block px-4 py-1.5 rounded-full border border-(--purple) bg-(--purple-subtle) text-(--purple) mb-4 text-xs font-bold tracking-wide shadow-custom ${className}`}
    >
      {text}
    </div>
  );
};

export default Badge;
