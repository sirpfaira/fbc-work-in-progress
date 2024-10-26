import React from "react";

type FormSkeletonProps = {
  rows?: number;
};

const FormSkeleton = ({ rows = 2 }: FormSkeletonProps) => {
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

export default FormSkeleton;
