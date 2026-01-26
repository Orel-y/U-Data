import React from 'react';

export const StatusBadge = ({ status }: { status: string }) => {
  const getColors = () => {
    switch (status) {
      case 'ACTIVE':
      case 'AVAILABLE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'OCCUPIED':
      case 'IN_MAINTENANCE':
      case 'MAINTENANCE':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'ARCHIVED':
      case 'RETIRED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  return (
    <span className={`px-1.5 sm:px-2.5 py-0.5 rounded-full text-[7px] sm:text-[10px] font-bold border inline-block whitespace-nowrap ${getColors()}`}>
      {status.replace('_', ' ')}
    </span>
  );
};