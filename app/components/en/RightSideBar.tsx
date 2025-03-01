"use client";
import Notification from "@/app/components/en/Notification";
import Suggestion from "@/app/components/en/punter/Suggestion";
import { TPunter } from "@/lib/schemas/punter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import { EllipsisVertical, Search } from "lucide-react";

const RightSideBar = () => {
  const {
    data: punters,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["punters"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/punters`);
      return data.items as TPunter[];
    },
  });

  if (isError) return <ErrorsTile errors={[error.message]} />;

  return (
    <div className="fixed hidden xl:block top-14 right-0 w-[420px] mt-5 overflow-y-hidden px-2">
      <div className="flex flex-col space-y-4 px-6 py-3 card">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-baseline">
            <h1 className="font-medium text-big">Notifications</h1>
            <p className="text-primary text-small">See all</p>
          </div>
          <div className="mb-4 mt-4">
            <Notification />
          </div>
        </div>
        <div className="py-1">
          <div className="h-[1px] bg-border"></div>
        </div>
        {isLoading ? (
          <TableSkeleton columns={3} />
        ) : (
          <>
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h1 className="font-medium text-big">Punters to follow</h1>
                <div className="flex space-x-4 items-center text-primary">
                  <Search size={18} />
                  <EllipsisVertical size={18} />
                </div>
              </div>
              <div className="flex flex-col space-y-5 mb-3">
                {punters?.slice(0, 4).map((punter) => (
                  <div key={punter.username}>
                    <Suggestion punter={punter} size={50} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RightSideBar;
