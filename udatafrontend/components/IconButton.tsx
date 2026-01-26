import React from 'react';

export const IconButton = ({ icon: Icon, onClick, label, variant = 'neutral' }: { icon: React.FC<any>, onClick: () => void, label: string, variant?: 'neutral' | 'danger' }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
      variant === 'danger' ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-[#0A7FC7] hover:bg-blue-50'
    }`}
    aria-label={label}
    title={label}
  >
    <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex items-center justify-center">
      <Icon />
    </div>
  </button>
);