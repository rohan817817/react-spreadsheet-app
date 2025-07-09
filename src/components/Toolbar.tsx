import React from 'react';

export default function Toolbar() {
  return (
    <div className="flex justify-end items-center gap-4 px-4 py-2 bg-white border-b border-gray-200 text-sm">
      <button className="px-3 py-1 border rounded hover:bg-gray-100" onClick={() => console.log('Filter clicked')}>
        Filter
      </button>
      <button className="px-3 py-1 border rounded hover:bg-gray-100" onClick={() => console.log('Export clicked')}>
        Export
      </button>
      <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => console.log('Share clicked')}>
        Share
      </button>
    </div>
  );
}
