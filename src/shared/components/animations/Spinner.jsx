import React from 'react'

export const Spinner = () => {
  return (
    <div className="p-1 min-h-full flex items-center justify-center text-center sm:p-0">
      <div className="w-4 h-4 relative bg-linear-to-r from-navy via-navy to-white rounded-full animate-spin">
        <div className="absolute left-1/2 top-1/2 flex items-center justify-center bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 w-3 h-3"></div>
      </div>
    </div>
  );
}