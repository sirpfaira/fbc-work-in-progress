"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TTrending } from "@/lib/schemas/trending";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import PageTitle from "@/app/components/common/PageTitle";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import Trending from "@/app/en/trending/Trending";
import FiveAside from "./FiveAside";
import BetBuilder from "./BetBuilder";

export default function ManageTrending() {
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
        <PageTitle title="Manage Trending" link="/en" />
      </div>
      <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
        {isLoading ? (
          <TableSkeleton columns={3} />
        ) : (
          <>
            {trending && (
              <Tabs defaultValue="trending" className="w-full max-w-[500px]">
                <TabsList className="flex justify-start w-full">
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="five_aside">Five Aside</TabsTrigger>
                  <TabsTrigger value="bet_builder">Bet Builder</TabsTrigger>
                </TabsList>
                <TabsContent value="trending">
                  <Trending trending={trending} />
                </TabsContent>
                <TabsContent value="five_aside">
                  <FiveAside trending={trending} />
                </TabsContent>
                <TabsContent value="bet_builder">
                  <BetBuilder trending={trending} />
                </TabsContent>
              </Tabs>
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
