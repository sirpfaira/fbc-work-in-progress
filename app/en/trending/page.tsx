"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { TTrending } from "@/lib/schemas/trending";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import PageTitle from "@/app/components/common/PageTitle";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import Trending from "@/app/en/trending/Trending";

export default function EnTrending() {
  const {
    data: trending,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/trending`);
      return data.items as TTrending[];
    },
  });

  if (isError) return <ErrorsTile errors={[error.message]} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Trending" link="/en" />
      </div>
      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <>{trending && <Trending trending={trending} />}</>
      )}
    </div>
  );
}
