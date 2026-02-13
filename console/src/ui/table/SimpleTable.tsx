import React from "react";
import type { Column } from "../../types/Types";

interface SimpleTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function SimpleTable<T>({ data, columns }: SimpleTableProps<T>) {
  return (
    <div className="overflow-x-auto bg-(--primary-bg) rounded-custom shadow-custom">
      <table className="min-w-full divide-y divide-(--border)">
        {/* Header */}
        <thead className="bg-(--main-subtle)">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-left text-xs font-bold text-(--main-emphasis) uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-(--primary-bg) divide-y divide-(--border)">
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-(--main-subtle)/50 transition-colors duration-150"
              >
                {columns.map((col, cidx) => (
                  <td
                    key={cidx}
                    className="px-6 py-4 text-sm text-(--text-color) whitespace-nowrap"
                  >
                    {typeof col.value === "function"
                      ? col.value(row)
                      : (row[col.value] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns?.length}
                className="px-6 py-10 text-center text-(--text-color) text-sm"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
