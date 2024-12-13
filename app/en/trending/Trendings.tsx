"use client";
import TrendingCard from "@/app/en/trending/TrendingCard";
import ErrorTile from "@/app/components/common/ErrorTile";
import { TTrending } from "@/lib/schemas/trending";

interface TrendingsProps {
  trendings: TTrending[];
}

export default function Trendings({ trendings }: Readonly<TrendingsProps>) {
  return (
    <>
      {trendings?.length > 0 ? (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-4">
            {trendings?.map((item) => (
              <div key={item._id.toString()}>
                <TrendingCard trending={item} />
              </div>
            ))}
          </div>
          {/* <div className="flex w-full justify-center items-center px-4 py-2 card">
                <PaginationComponent hasNext={hasNext} />
              </div> */}
        </div>
      ) : (
        <ErrorTile error="Nothing to show!" />
      )}
    </>
  );
}
