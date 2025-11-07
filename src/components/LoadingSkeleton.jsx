import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 animate-pulse">
    <div className="h-32 sm:h-40 w-full bg-gray-700"></div>
    <div className="p-2 sm:p-4 space-y-3">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      <div className="h-5 bg-gray-700 rounded w-1/3"></div>
      <div className="h-8 bg-gray-700 rounded"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-700 rounded w-20"></div></td>
    <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-700 rounded w-32"></div></td>
    <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-700 rounded w-24"></div></td>
    <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-700 rounded w-16"></div></td>
    <td className="px-4 sm:px-6 py-4"><div className="h-6 bg-gray-700 rounded w-20"></div></td>
  </tr>
);

export const StatCardSkeleton = () => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 animate-pulse">
    <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
    <div className="h-8 bg-gray-700 rounded w-1/3"></div>
  </div>
);

