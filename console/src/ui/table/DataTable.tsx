import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { Table } from "./Table";
import "react-datepicker/dist/react-datepicker.css";
import type { Column } from "../../types/Types";
import { generateSlug } from "../../contexts/Callbacks";
import { BiSearch } from "react-icons/bi";
import FilterPanel from "./data-table-compoents/FilterPanel";
import { SecondButton } from "../button/Button";

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
        if (urlValue !== appliedFilters[key]) hasChanges = true;
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
    setShowFilter(false);
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
      if (typeof valA === "number" && typeof valB === "number")
        return sortDirection === "asc" ? valA - valB : valB - valA;
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

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {title && (
          <h2 className="text-xl font-bold text-(--text-color) tracking-tight">
            {title}
          </h2>
        )}
        <div
          className={`flex flex-col sm:flex-row gap-3 ${!title ? "w-full" : ""}`}
        >
          {searchInput && (
            <div className="relative flex-1 min-w-70">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--text-color) w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-custom bg-(--primary-bg) text-(--text-color-emphasis) placeholder-(--text-color) focus:outline-none focus:ring-2 focus:ring-(--main) focus:border-transparent shadow-custom transition-all"
              />
            </div>
          )}
          <div className="flex gap-2">
            <SecondButton
              label="Filters"
              onClick={() => setShowFilter(!showFilter)}
              className="bg-(--primary-bg) border-0! shadow-custom"
            />

            {includeExportFields && includeExportFields.length > 0 && (
              <div className="relative z-20">
                <SecondButton
                  label="Export"
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="bg-(--primary-bg) border-0! shadow-custom"
                />
                {showExportDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowExportDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 p-2 bg-(--primary-bg) rounded-custom shadow-custom z-30 overflow-hidden ring-1 ring-(--main) ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleExport("csv");
                            setShowExportDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-(--text-color) hover:bg-(--main-subtle) hover:text-(--main) rounded-custom transition-colors"
                        >
                          Export as CSV
                        </button>
                        <button
                          onClick={() => {
                            handleExport("excel");
                            setShowExportDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-(--text-color) hover:bg-(--main-subtle) hover:text-(--main) rounded-custom transition-colors"
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

      <FilterPanel
        showFilter={showFilter}
        tabFilters={tabFilters}
        handleClearFilters={handleClearFilters}
        handleApplyFilters={handleApplyFilters}
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        data={data}
        datePickerStartDate={datePickerStartDate}
        setDatePickerStartDate={setDatePickerStartDate}
        datePickerEndDate={datePickerEndDate}
        setDatePickerEndDate={setDatePickerEndDate}
      />

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
