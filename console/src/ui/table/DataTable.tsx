import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { Table } from "./Table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Column } from "../../types/Types";
import { generateSlug } from "../../contexts/Callbacks";
import {
  BiChevronDown,
  BiDownload,
  BiSearch,
  BiCalendar,
  BiX,
} from "react-icons/bi";
import { FiFilter } from "react-icons/fi";

export interface TabFilterConfig<T> {
  label: string;
  columns: string[];
  filterField: keyof T;
  options?: string[];
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  tabFilters?: TabFilterConfig<T>[];
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  title?: string;
  includeExportFields?: (keyof T)[];
  searchFields?: (keyof T)[];
  searchInput?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  tabFilters,
  rowsPerPageOptions = [5, 10, 15, 20],
  defaultRowsPerPage = 10,
  title,
  includeExportFields,
  searchFields,
  searchInput = true,
}: DataTableProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") || 1),
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    Number(searchParams.get("rows") || defaultRowsPerPage),
  );

  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null,
  );

  const [datePickerStartDate, setDatePickerStartDate] = useState<Date | null>(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : null,
  );
  const [datePickerEndDate, setDatePickerEndDate] = useState<Date | null>(
    searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null,
  );

  const [appliedStartDate, setAppliedStartDate] = useState<Date | null>(
    datePickerStartDate,
  );
  const [appliedEndDate, setAppliedEndDate] = useState<Date | null>(
    datePickerEndDate,
  );

  const initialFilters =
    tabFilters?.reduce(
      (acc, f) => {
        const param = searchParams.get(String(f.filterField)) || "";
        acc[String(f.filterField)] = param;
        return acc;
      },
      {} as Record<string, string>,
    ) || {};

  const [appliedFilters, setAppliedFilters] =
    useState<Record<string, string>>(initialFilters);
  const [tempFilters, setTempFilters] =
    useState<Record<string, string>>(initialFilters);

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const merged = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) merged.delete(key);
      else merged.set(key, value);
    });
    setSearchParams(merged);
  };

  useEffect(() => {
    const paramSearch = searchParams.get("search") || "";
    if (paramSearch !== searchTerm) setSearchTerm(paramSearch);

    const paramPage = Number(searchParams.get("page") || 1);
    if (paramPage !== currentPage) setCurrentPage(paramPage);

    const paramRows = Number(searchParams.get("rows") || defaultRowsPerPage);
    if (paramRows !== rowsPerPage) setRowsPerPage(paramRows);

    const paramStart = searchParams.get("startDate");
    const paramEnd = searchParams.get("endDate");
    const newStart = paramStart ? new Date(paramStart) : null;
    const newEnd = paramEnd ? new Date(paramEnd) : null;

    if (newStart?.toISOString() !== appliedStartDate?.toISOString()) {
      setAppliedStartDate(newStart);
      setDatePickerStartDate(newStart);
    }
    if (newEnd?.toISOString() !== appliedEndDate?.toISOString()) {
      setAppliedEndDate(newEnd);
      setDatePickerEndDate(newEnd);
    }

    if (tabFilters) {
      const newFiltersFromUrl: Record<string, string> = {};
      let hasChanges = false;

      tabFilters.forEach((f) => {
        const key = String(f.filterField);
        const urlValue = searchParams.get(key) || "";
        newFiltersFromUrl[key] = urlValue;

        if (urlValue !== appliedFilters[key]) {
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setAppliedFilters(newFiltersFromUrl);
        setTempFilters(newFiltersFromUrl);
      }
    }
  }, [searchParams, defaultRowsPerPage]);

  useEffect(() => {
    const updates: Record<string, string | null> = {
      search: searchTerm ? generateSlug(searchTerm) : null,
      page: currentPage !== 1 ? String(currentPage) : null,
      rows: rowsPerPage !== defaultRowsPerPage ? String(rowsPerPage) : null,
      startDate: appliedStartDate ? appliedStartDate.toISOString() : null,
      endDate: appliedEndDate ? appliedEndDate.toISOString() : null,
    };

    Object.entries(appliedFilters).forEach(([key, value]) => {
      updates[key] = value || null;
    });

    updateSearchParams(updates);
  }, [
    searchTerm,
    currentPage,
    rowsPerPage,
    defaultRowsPerPage,
    appliedFilters,
    appliedStartDate,
    appliedEndDate,
  ]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setAppliedStartDate(datePickerStartDate);
    setAppliedEndDate(datePickerEndDate);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const cleared =
      tabFilters?.reduce(
        (acc, f) => ({ ...acc, [String(f.filterField)]: "" }),
        {},
      ) || {};
    setTempFilters(cleared);
    setAppliedFilters(cleared);
    setDatePickerStartDate(null);
    setDatePickerEndDate(null);
    setAppliedStartDate(null);
    setAppliedEndDate(null);
    setCurrentPage(1);
  };

  const handleSort = (colKey: string) => {
    if (sortColumn === colKey) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(colKey);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    const col = columns.find(
      (c, idx) =>
        (typeof c.value === "string" ? c.value : c.key || String(idx)) ===
        sortColumn,
    );
    if (!col) return data;

    const keyToSort =
      (col as any).sortingKey ||
      (typeof col.value === "string" ? col.value : null);
    if (!keyToSort) return data;

    return [...data].sort((a, b) => {
      const valA = a[keyToSort as keyof T];
      const valB = b[keyToSort as keyof T];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [data, sortColumn, sortDirection, columns]);

  const filteredData = useMemo(() => {
    const fieldsToSearch =
      searchFields ??
      columns
        .filter((c) => typeof c.value === "string")
        .map((c) => c.value as keyof T);

    return (sortedData?.length > 0 ? sortedData : []).filter((row) => {
      const searchMatch = searchTerm
        ? fieldsToSearch.some((field) => {
            const val = row[field];
            return (
              val &&
              generateSlug(String(val)).includes(generateSlug(searchTerm))
            );
          })
        : true;

      const dynamicMatch = Object.keys(appliedFilters).every((key) => {
        if (!appliedFilters[key]) return true;
        const rowVal = String(row[key as keyof T] ?? "");
        return generateSlug(rowVal) === generateSlug(appliedFilters[key]);
      });

      const dateMatch =
        appliedStartDate || appliedEndDate
          ? (() => {
              const createdAt = row["createdAt" as keyof T];
              if (!createdAt || typeof createdAt !== "string") return false;
              const createdAtDate = new Date(createdAt);
              if (isNaN(createdAtDate.getTime())) return false;

              if (appliedStartDate) {
                const start = new Date(appliedStartDate);
                start.setHours(0, 0, 0, 0);
                if (createdAtDate < start) return false;
              }
              if (appliedEndDate) {
                const end = new Date(appliedEndDate);
                end.setHours(23, 59, 59, 999);
                if (createdAtDate > end) return false;
              }
              return true;
            })()
          : true;

      return searchMatch && dynamicMatch && dateMatch;
    });
  }, [
    sortedData,
    searchTerm,
    appliedFilters,
    appliedStartDate,
    appliedEndDate,
    columns,
    searchFields,
  ]);

  const handleExport = (format: "csv" | "excel") => {
    if (!filteredData.length) {
      alert("No data to export.");
      return;
    }

    if (!includeExportFields || !includeExportFields.length) return;

    const keys = includeExportFields.map(String);
    const exportData = filteredData.map((row) => {
      const obj: Record<string, string> = {};
      keys.forEach((k) => {
        obj[k] = String(row[k] ?? "");
      });
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `data.${format === "csv" ? "csv" : "xlsx"}`);
  };

  const FilterPanel = () => (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4 grid grid-cols-1 md:grid-cols-3 gap-5 shadow-inner transition-all duration-300 ease-in-out ${
        showFilter ? "opacity-100 max-h-125" : "hidden opacity-0 max-h-0"
      }`}
    >
      {tabFilters?.map((filter) => (
        <div key={String(filter.filterField)} className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1.5 ml-1">
            {filter.label}
          </label>
          <div className="relative">
            <select
              value={tempFilters[String(filter.filterField)]}
              onChange={(e) =>
                setTempFilters((prev) => ({
                  ...prev,
                  [String(filter.filterField)]: generateSlug(e.target.value),
                }))
              }
              className="w-full pl-3 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow appearance-none cursor-pointer"
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
            <BiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      ))}

      <div className="flex flex-col md:col-span-2 lg:col-span-1">
        <label className="text-sm font-semibold text-gray-700 mb-1.5 ml-1">
          Time Range
        </label>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <BiCalendar className="text-gray-400" />
            </div>
            <DatePicker
              selected={datePickerStartDate}
              onChange={(date: Date | null) => setDatePickerStartDate(date)}
              selectsStart
              startDate={datePickerStartDate}
              endDate={datePickerEndDate}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
              dateFormat="dd/MM/yyyy"
              placeholderText="Start Date"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <BiCalendar className="text-gray-400" />
            </div>
            <DatePicker
              selected={datePickerEndDate}
              onChange={(date: Date | null) => setDatePickerEndDate(date)}
              selectsEnd
              startDate={datePickerStartDate}
              endDate={datePickerEndDate}
              minDate={datePickerStartDate || undefined}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
              dateFormat="dd/MM/yyyy"
              placeholderText="End Date"
            />
          </div>
        </div>
      </div>

      <div className="flex items-end justify-end gap-3 col-span-1 md:col-span-3 pt-2">
        <button
          onClick={handleClearFilters}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors flex items-center"
        >
          <BiX className="w-5 h-5 mr-1" />
          Clear
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {title && (
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
        )}

        <div
          className={`flex flex-col sm:flex-row gap-3 ${
            !title ? "w-full" : ""
          }`}
        >
          {searchInput && (
            <div className="relative flex-1 min-w-70">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center justify-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-all shadow-sm ${
                showFilter
                  ? "bg-purple-50 border-purple-200 text-purple-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-purple-600"
              }`}
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filter
            </button>

            {includeExportFields && includeExportFields.length > 0 && (
              <div className="relative z-20">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-purple-600 shadow-sm transition-all"
                >
                  <BiDownload className="w-4 h-4 mr-2" />
                  Export
                  <BiChevronDown
                    className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                      showExportDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showExportDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowExportDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-30 overflow-hidden ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleExport("csv");
                            setShowExportDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          Export as CSV
                        </button>
                        <button
                          onClick={() => {
                            handleExport("excel");
                            setShowExportDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          Export as Excel
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <FilterPanel />

      <Table
        data={filteredData}
        columns={columns}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        rowsPerPageOptions={rowsPerPageOptions}
        setRowsPerPage={setRowsPerPage}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
}
