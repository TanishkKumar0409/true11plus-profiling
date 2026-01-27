import React from "react";
import type { Column } from "../../types/Types";

interface SimpleTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export function SimpleTable<T>({ data, columns }: SimpleTableProps<T>) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Header */}
        <thead className="bg-purple-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-purple-50/50 transition-colors duration-150"
              >
                {columns.map((col, cidx) => (
                  <td
                    key={cidx}
                    className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
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
                className="px-6 py-10 text-center text-gray-400 text-sm"
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
