"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import PageTitle from "@/app/components/common/PageTitle";
import { TTrending } from "@/lib/schemas/trending";
import { TCompetition } from "@/lib/schemas/competition";
import FetchCards from "./FetchCards";
import { TFixture } from "@/lib/schemas/fixture";

export default function TrendingResults() {
  const {
    data: fixtures,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["all-fixtures"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/fixtures?filter=all`);
      return data.items as TFixture[];
    },
  });

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/trending`);
      return data.items as TTrending[];
    },
  });

  const { data: competitions } = useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/competitions`);
      return data.items as TCompetition[];
    },
  });

  if (isError) return <ErrorsTile errors={[`${error.message}`]} />;

  return (
    <div className="flex flex-col space-y-5">
      <div className="card flex items-center justify-between px-4 py-2">
        <PageTitle title="Fetch Trending Results" link="/en/trending" />
      </div>
      <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
        {isLoading ? (
          <TableSkeleton columns={3} />
        ) : (
          <>
            {fixtures && trending && competitions && (
              <FetchCards
                fixtures={fixtures}
                trending={trending}
                competitions={competitions}
              />
            )}
          </>
        )}
        <div className="hidden lg:flex flex-col card p-6">
          <span>Sidebar</span>
        </div>
      </div>
    </div>
  );
}
