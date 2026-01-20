import React from 'react';

// Define the shape of a column
export interface Column<T> {
  header: string;
  accessor?: keyof T; // Key to access data directly (optional if using render)
  render?: (item: T) => React.ReactNode; // Custom render function for complex cells
  className?: string; // Optional custom styling for the cell
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

const Table = <T extends { id: number | string }>({ data, columns }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-xs">
      <table className="w-full text-left border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="bg-slate-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
            {columns.map((col, index) => (
              <th key={index} className={`px-6 py-3 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-50 text-sm text-slate-700">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-200">
              {columns.map((col, index) => (
                <td key={index} className={`px-6 py-4 ${col.className || ''}`}>
                  {/* Logic: If 'render' exists, use it. Otherwise, display the plain data. */}
                  {col.render
                    ? col.render(item)
                    : (col.accessor ? item[col.accessor] as React.ReactNode : null)
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 