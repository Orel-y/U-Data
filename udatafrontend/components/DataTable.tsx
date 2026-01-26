import React, { useState, useMemo, ReactNode } from 'react';

interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    key: keyof T | string;
    render?: (item: T) => ReactNode;
  }[];
  isLoading?: boolean;
}

export const DataTable = <T extends { id: string }>({ data, columns, isLoading }: TableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const sortedAndFilteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => 
      Object.values(item).some(val => String(val).toLowerCase().includes(lowerSearch))
    );
  }, [data, searchTerm]);

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:ring-4 focus:ring-[#0A7FC7]/10 focus:border-[#0A7FC7] outline-none transition-all"
          />
          <svg className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sortedAndFilteredData.length} Records</div>
      </div>

      <div className="w-full">
        <table className="w-full text-left table-fixed sm:table-auto border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col, idx) => (
                <th key={idx} className="px-2 sm:px-6 py-3 sm:py-5 text-[8px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-tight sm:tracking-[0.1em] break-words">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
               <tr><td colSpan={columns.length} className="p-8 sm:p-16 text-center text-gray-400 font-medium text-[10px] sm:text-sm">Loading data...</td></tr>
            ) : sortedAndFilteredData.length === 0 ? (
               <tr><td colSpan={columns.length} className="p-8 sm:p-16 text-center text-gray-400 font-medium text-[10px] sm:text-sm">No results found</td></tr>
            ) : sortedAndFilteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                {columns.map((col, idx) => (
                  <td key={idx} className="px-2 sm:px-6 py-2.5 sm:py-4.5 text-[9px] sm:text-sm whitespace-normal break-words leading-tight align-middle">
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};