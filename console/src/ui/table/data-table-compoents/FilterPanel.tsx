import React from "react";
import DatePicker from "react-datepicker";
import { BiChevronDown } from "react-icons/bi";
import type { TabFilterConfig } from "../DataTable";
import { generateSlug } from "../../../contexts/Callbacks";
import { ButtonGroup, SecondButton } from "../../button/Button";

interface FilterPanelProps<T extends Record<string, unknown>> {
  showFilter: boolean;
  tabFilters?: TabFilterConfig<T>[];
  handleClearFilters: () => void;
  handleApplyFilters: () => void;
  tempFilters: Record<string, string>;
  setTempFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  data: T[];
  datePickerStartDate: Date | null;
  setDatePickerStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  datePickerEndDate: Date | null;
  setDatePickerEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

export default function FilterPanel<T extends Record<string, unknown>>({
  showFilter,
  tabFilters,
  handleClearFilters,
  handleApplyFilters,
  tempFilters,
  setTempFilters,
  data,
  datePickerStartDate,
  setDatePickerStartDate,
  datePickerEndDate,
  setDatePickerEndDate,
}: FilterPanelProps<T>) {
  return (
    <div
      className={`bg-(--primary-bg) rounded-custom p-5 mb-4 grid grid-cols-1 md:grid-cols-3 gap-5 shadow-custom transition-all duration-300 ease-in-out ${
        showFilter
          ? "opacity-100 max-h-125"
          : "hidden opacity-0 max-h-0 pointer-events-none"
      }`}
    >
      {tabFilters?.map((filter) => (
        <div key={String(filter.filterField)} className="flex flex-col">
          <label className="block text-xs text-(--text-color) mb-1">
            {filter.label}
          </label>
          <div className="relative">
            <select
              value={tempFilters[String(filter.filterField)]}
              onChange={(e) =>
                setTempFilters((prev) => ({
                  ...prev,
                  [String(filter.filterField)]: e.target.value,
                }))
              }
              className="w-full text-xs border border-(--border) bg-(--primary-bg) text-(--text-color-emphasis) rounded-custom p-2 appearance-none focus:ring-1 focus:ring-(--border) outline-none font-semibold"
            >
              <option value="">All</option>
              {(
                filter.options ||
                Array.from(
                  new Set(
                    data.map((item) => String(item[filter.filterField] ?? "")),
                  ),
                ).filter(Boolean)
              ).map((option) => (
                <option key={option} value={generateSlug(option)}>
                  {option}
                </option>
              ))}
            </select>
            <BiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-color) pointer-events-none" />
          </div>
        </div>
      ))}

      <div className="flex flex-col md:col-span-2 lg:col-span-1">
        <label className="block text-xs text-(--text-color) mb-1">
          Time Range
        </label>
        <div className="flex items-center gap-1">
          <div className="relative w-full">
            <DatePicker
              selected={datePickerStartDate}
              onChange={(date: Date | null) => setDatePickerStartDate(date)}
              selectsStart
              startDate={datePickerStartDate}
              endDate={datePickerEndDate}
              className="w-full text-xs border border-(--border) bg-(--primary-bg) text-(--text-color-emphasis) rounded-custom p-2 appearance-none focus:ring-1 focus:ring-(--border) outline-none font-semibold"
              dateFormat="dd/MM/yyyy"
              placeholderText="Start Date"
            />
          </div>
          <div className="relative w-full">
            <DatePicker
              selected={datePickerEndDate}
              onChange={(date: Date | null) => setDatePickerEndDate(date)}
              selectsEnd
              startDate={datePickerStartDate}
              endDate={datePickerEndDate}
              minDate={datePickerStartDate || undefined}
              className="w-full text-xs border border-(--border) bg-(--primary-bg) text-(--text-color-emphasis) rounded-custom p-2 appearance-none focus:ring-1 focus:ring-(--border) outline-none font-semibold"
              dateFormat="dd/MM/yyyy"
              placeholderText="End Date"
            />
          </div>
        </div>
      </div>

      <div className="flex items-end justify-end gap-3 col-span-1 md:col-span-3 pt-2">
        <SecondButton label="Clear" onClick={handleClearFilters} />
        <ButtonGroup label="Apply Filters" onClick={handleApplyFilters} />
      </div>
    </div>
  );
}
