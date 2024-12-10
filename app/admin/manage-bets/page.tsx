"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import ErrorTile from "@/app/components/common/ErrorTile";
import TableSkeleton from "@/app/components/common/LoadingSkeletons";
import PageTitle from "@/app/components/common/PageTitle";
import { TDummy } from "@/lib/schemas/dummy";
import { TBet } from "@/lib/schemas/bet";
import Link from "next/link";

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

  if (isError) return <ErrorTile error={error.message} />;

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
        <>{bets && dummies && <DummyBets bets={bets} dummies={dummies} />}</>
      )}
    </div>
  );
}

interface DummyBetsProps {
  bets: TBet[];
  dummies: TDummy[];
}

function DummyBets({ bets, dummies }: DummyBetsProps) {
  const dummyUsernames = dummies.map((item) => {
    return item.username;
  });
  const dummyBets = bets.filter((item) =>
    dummyUsernames.includes(item.username)
  );
  return (
    <div>
      {dummyBets.map((item) => (
        <div key={item.uid}>
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
}
