"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import PageTitle from "@/app/components/common/PageTitle";
import { TDummy } from "@/lib/schemas/dummy";
import { TBet } from "@/lib/schemas/bet";
import Link from "next/link";
import { TTrending } from "@/lib/schemas/trending";
import Bets from "@/app/en/bets/Bets";

export default function ManageBets() {
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

  const { data: dummies } = useQuery({
    queryKey: ["dummies"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/dummies`);
      return data.items as TDummy[];
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
        <PageTitle title="Manage Bets" link="/admin" />
        <Link href={"/admin/manage-bets/create"}>
          <PlusCircle size={26} />
        </Link>
      </div>
      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <>
          {bets && dummies && trending && (
            <DummyBets bets={bets} dummies={dummies} trending={trending} />
          )}
        </>
      )}
    </div>
  );
}

interface DummyBetsProps {
  bets: TBet[];
  dummies: TDummy[];
  trending: TTrending[];
}

function DummyBets({ bets, dummies, trending }: DummyBetsProps) {
  const dummyUsernames = dummies.map((item) => {
    return item.username;
  });

  const dummyBets = bets.filter((item) =>
    dummyUsernames.includes(item.user.username)
  );

  return (
    <div className="grid w-full lg:grid-cols-[520px_1fr] gap-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4">
          <Bets bets={dummyBets} trending={trending} />
        </div>
      </div>
      <div className="hidden lg:flex flex-col card p-6">
        <span>Sidebar</span>
        <pre className="mt-2 w-full rounded-md bg-muted-block p-4">
          <code className="text-sky-600">
            {JSON.stringify(dummyBets?.[0], null, 2)}
          </code>
        </pre>
      </div>
    </div>
  );
}
