import React from "react";

type FormSkeletonProps = {
  rows?: number;
};

export const FormSkeleton = ({ rows = 2 }: FormSkeletonProps) => {
  return (
    <div className="flex flex-col space-y-3">
      {Array.from(Array(rows).keys()).map((item) => (
        <div key={item} className="animate-pulse card p-6">
          <div className="h-4 bg-gray-200 mt-3 mb-6 rounded"></div>
          <div className="h-10 bg-gray-300 mb-6 rounded"></div>
        </div>
      ))}
    </div>
  );
};

type TableSkeletonProps = {
  columns?: number;
  rows?: number;
};

export const TableSkeleton = ({
  columns = 3,
  rows = 10,
}: TableSkeletonProps) => {
  return (
    <div className="flex flex-col space-y-5 card p-6">
      {Array.from(Array(rows).keys()).map((row) => (
        <div key={row} className="flex space-x-3">
          {Array.from(Array(columns).keys()).map((column) => (
            <div
              key={`${row}:${column}`}
              className="flex flex-1 h-5 bg-muted rounded animate-pulse"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
