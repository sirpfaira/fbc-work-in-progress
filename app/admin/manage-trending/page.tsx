"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TTrending } from "@/lib/schemas/trending";
import ErrorTile from "@/app/components/common/ErrorTile";
import PageTitle from "@/app/components/common/PageTitle";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import Trendings from "@/app/en/trending/Trendings";
import FiveAside from "./FiveAside";
import BetBuilder from "./BetBuilder";

export default function ManageTrendings() {
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
        <PageTitle title="Manage Trendings" link="/en" />
      </div>
      <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
        {isLoading ? (
          <TableSkeleton columns={3} />
        ) : (
          <>
            {trendings && (
              <Tabs defaultValue="trending" className="w-full max-w-[500px]">
                <TabsList className="flex justify-start w-full">
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="five_aside">Five Aside</TabsTrigger>
                  <TabsTrigger value="bet_builder">Bet Builder</TabsTrigger>
                </TabsList>
                <TabsContent value="trending">
                  <Trendings trendings={trendings} />
                </TabsContent>
                <TabsContent value="five_aside">
                  <FiveAside trendings={trendings} />
                </TabsContent>
                <TabsContent value="bet_builder">
                  <BetBuilder trendings={trendings} />
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
