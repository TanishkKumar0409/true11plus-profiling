export const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderColor: state.isFocused ? "#9333ea" : "#d1d5db", // Purple-600 : Gray-300
    boxShadow: state.isFocused ? "0 0 0 1px #9333ea" : "none",
    "&:hover": {
      borderColor: "#9333ea",
    },
    padding: "2px",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    minHeight: "42px",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#9333ea"
      : state.isFocused
        ? "#f3e8ff"
        : "white",
    color: state.isSelected ? "white" : "#374151",
    fontSize: "0.875rem",
    cursor: "pointer",
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 50,
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  }),
};

export const CLASS_OPTIONS = [
  "Kindergarten",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

export const phoneInputClass = {
  input:
    "!w-full !py-1.5 !border !border-[var(--border)] !rounded-lg !bg-transparent !text-[var(--text-color-emphasis)]",
  button:
    "!border !border-[var(--border)] !rounded-lg !bg-transparent !text-[var(--text-color-emphasis)]",
  dropdown:
    "!bg-[var(--primary-bg)] !rounded-lg shadow-sm !text-[var(--text-color)]",
};
