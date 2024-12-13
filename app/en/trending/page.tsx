"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { TTrending } from "@/lib/schemas/trending";
import ErrorTile from "@/app/components/common/ErrorTile";
import PageTitle from "@/app/components/common/PageTitle";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import Trendings from "@/app/en/trending/Trendings";

export default function EnTrendings() {
  const {
    data: trendings,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["trendings"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/trendings`);
      return data.items as TTrending[];
    },
  });

  if (isError) return <ErrorTile error={error.message} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Trending" link="/en" />
      </div>
      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <>{trendings && <Trendings trendings={trendings} />}</>
      )}
    </div>
  );
}
