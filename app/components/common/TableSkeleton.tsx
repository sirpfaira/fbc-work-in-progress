import React from "react";

type TableSkeletonProps = {
  columns: number;
};

const TableSkeleton = ({ columns }: TableSkeletonProps) => {
  return (
    <div className="animate-pulse card p-6">
      <div className="h-4 bg-gray-200 mt-3 mb-6 rounded"></div>
      <div className="h-4 bg-gray-300 mb-6 rounded"></div>
      <div className="h-4 bg-gray-200 mb-6 rounded"></div>
      <div className="h-4 bg-gray-300 mb-6 rounded"></div>
      <div className="h-4 bg-gray-200 mb-6 rounded"></div>
    </div>
  );
};

export default TableSkeleton;
