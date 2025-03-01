"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { TBet } from "@/lib/schemas/bet";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import PageTitle from "@/app/components/common/PageTitle";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import Bets from "@/app/en/bets/Bets";
import { TTrending } from "@/lib/schemas/trending";

export default function EnBets() {
  const {
    data: bets,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["bets"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/bets`);
      return data.items as TBet[];
    },
  });

  const { data: trending } = useQuery({
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
        <PageTitle title="Bet" link="/en" />
      </div>
      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <>{bets && trending && <Bets bets={bets} trending={trending} />}</>
      )}
    </div>
  );
}
