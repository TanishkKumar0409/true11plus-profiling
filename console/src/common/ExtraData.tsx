import type { ClassNamesConfig } from "react-select";

export const phoneInputStyle = {
  container: "!w-full",
  input:
    "!w-full paragraph !text-gray-900 !bg-white rounded-custom border! border-(--border)! focus:!ring-2 focus:!ring-purple-500 focus:!border-transparent",
  button: "!bg-gray-50 !border-gray-200 !rounded-l-lg hover:!bg-gray-100",
  dropdown: "!bg-white !shadow-lg rounded-custom !border-gray-100",
};

export const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderColor: state.isFocused ? "#9333ea" : "#d1d5db",
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

export const reactSelectDesignClass: ClassNamesConfig<any, true> = {
  control: (state) =>
    `!rounded-lg !border !bg-white !px-1 !min-h-[42px] !shadow-sm transition-all ${
      state.isFocused
        ? "!border-purple-500 !ring-2 !ring-purple-500/20"
        : "!border-gray-200 hover:!border-purple-400"
    }`,
  menu: () =>
    "!bg-white !border !border-gray-100 !rounded-lg !shadow-lg !mt-1 !z-50",
  option: (state) =>
    `!cursor-pointer !px-4 !py-2.5 !text-sm ${
      state.isSelected
        ? "!bg-purple-600 !text-white"
        : state.isFocused
          ? "!bg-purple-50 !text-purple-700"
          : "!text-gray-700"
    }`,
  multiValue: () => "!bg-purple-50 !rounded-md !m-1",
  multiValueLabel: () => "!text-sm !text-purple-700 !font-medium !px-2",
  multiValueRemove: () =>
    "!text-purple-500 hover:!bg-purple-200 hover:!text-purple-800 !rounded-r-md !cursor-pointer",
  placeholder: () => "!text-gray-400 !text-sm",
  singleValue: () => "!text-gray-800 !text-sm",
  input: () => "!text-gray-800 !text-sm",
};

export const durationType = ["hour", "week", "day", "month", "year"];
