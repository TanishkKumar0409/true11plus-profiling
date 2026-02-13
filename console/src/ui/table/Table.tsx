import React, { useMemo, useEffect } from "react";
import type { Column } from "../../types/Types";
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
  BiSortAlt2,
  BiSortDown,
  BiSortUp,
} from "react-icons/bi";

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  rowsPerPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPageOptions?: number[];
  setRowsPerPage?: (rows: number) => void;
  sortColumn?: string | null;
  sortDirection?: "asc" | "desc" | null;
  onSort?: (colKey: string) => void;
}

const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");

export function Table<T>({
  data,
  columns,
  currentPage,
  rowsPerPage = 10,
  setCurrentPage,
  rowsPerPageOptions = [5, 10, 15, 20],
  setRowsPerPage,
  sortColumn,
  sortDirection,
  onSort,
}: TableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));

  // --- 1. Safety Check: Ensure currentPage is valid ---
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, setCurrentPage]);

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;
    const col = columns.find((c, idx) => {
      const colKey =
        typeof c.value === "string" ? c.value : c.key || String(idx);
      return colKey === sortColumn;
    });
    if (!col) return data;
    const keyToSort =
      (col as any).sortingKey ||
      (typeof col.value === "string" ? col.value : null);
    if (!keyToSort) return data;

    return [...data].sort((a: any, b: any) => {
      const aVal = a[keyToSort];
      const bVal = b[keyToSort];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortColumn, sortDirection, columns]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const getPageNumbers = () => {
    const siblingCount = 1;
    const totalPageNumbers = siblingCount + 5;

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [1, "...", ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [1, "...", ...middleRange, "...", totalPages];
    }

    return [];
  };

  return (
    <div className="w-full flex flex-col bg-(--primary-bg) rounded-custom shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-(--border)">
          <thead className="bg-(--main-subtle)">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-(--main) uppercase tracking-wider w-16">
                #
              </th>
              {columns.map((col, idx) => {
                const colKey =
                  typeof col.value === "string"
                    ? col.value
                    : col.key || String(idx);
                const isSorted = sortColumn === colKey;

                return (
                  <th
                    key={idx}
                    onClick={() => onSort?.(colKey)}
                    className="px-6 py-4 text-left text-xs font-bold text-(--main-emphasis) uppercase tracking-wider cursor-pointer select-none group transition-colors hover:bg-purple-100/50"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      <span className="text-base text-(--main)">
                        {isSorted ? (
                          sortDirection === "asc" ? (
                            <BiSortUp />
                          ) : (
                            <BiSortDown />
                          )
                        ) : (
                          <BiSortAlt2 className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-(--primary-bg) divide-y divide-(--border)">
            {paginatedData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-(--main-subtle)/60 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-(--text-color) font-medium">
                  {(currentPage - 1) * rowsPerPage + idx + 1}
                </td>
                {columns.map((col, cidx) => (
                  <td
                    key={cidx}
                    className="px-6 py-4 whitespace-nowrap text-sm text-(--text-color)"
                  >
                    {typeof col.value === "function"
                      ? col.value(row)
                      : (row[col.value] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-16 text-center text-(--text-color)"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm">No data available</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-(--border) bg-(--primary-bg)">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-(--text-color)">
            Showing{" "}
            <span className="font-bold text-(--text-color-emphasis)">
              {(currentPage - 1) * rowsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-(--text-color-emphasis)">
              {Math.min(currentPage * rowsPerPage, data.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-(--text-color-emphasis)">
              {data.length}
            </span>{" "}
            entries
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Rows Per Page Selector */}
            {setRowsPerPage && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-(--text-color)">Rows:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="block w-full rounded-lg border-(--border) bg-(--main-subtle) text-(--main) py-1.5 pl-3 pr-8 text-sm focus:border-(--main) focus:ring-(--main) cursor-pointer outline-none"
                >
                  {rowsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-custom text-(--text-color) hover:bg-(--secondary-bg) hover:text-(--main) disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                title="First Page"
              >
                <BiChevronsLeft className="h-5 w-5" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-custom text-(--text-color) hover:bg-(--secondary-bg) hover:text-(--main) disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                title="Previous Page"
              >
                <BiChevronLeft className="h-5 w-5" />
              </button>

              {/* Page Numbers */}
              <div className="hidden sm:flex items-center gap-1 mx-2">
                {getPageNumbers().map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={idx}
                      className="px-3 py-1 text-(--text-color) select-none"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(p as number)}
                      className={classNames(
                        "min-w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                        currentPage === p
                          ? "bg-(--main) text-(--main-subtle) shadow-custom"
                          : "text-(--text-color) hover:bg-(--main-subtle) hover:text-(--main)",
                      )}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-custom text-(--text-color) hover:bg-(--secondary-bg) hover:text-(--main) disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                title="Next Page"
              >
                <BiChevronRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-custom text-(--text-color) hover:bg-(--secondary-bg) hover:text-(--main) disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                title="Last Page"
              >
                <BiChevronsRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
