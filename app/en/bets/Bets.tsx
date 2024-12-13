import { useState } from "react";
import Multiple from "@/app/en/bets/Multiple";
// import { PaginationComponent } from "@/app/components/Pagination";
import ErrorTile from "@/app/components/common/ErrorTile";
import { TBet, XBet } from "@/lib/schemas/bet";
import { ITrending, TTrending } from "@/lib/schemas/trending";
import { Button } from "@/components/ui/button";

interface BetsProps {
  bets: TBet[];
  trendings: TTrending[];
}

export default function Bets({ bets, trendings }: Readonly<BetsProps>) {
  const [filtered, setFiltered] = useState<XBet[]>(getXBets());

  function getSelections(selections: string[]): ITrending[] {
    const result: ITrending[] = [];
    selections.map((item) => {
      const trend = trendings.find((el) => el.uid === item);
      if (trend) {
        const newItem = {
          value: trend.value,
          date: trend.date,
          uid: item,
          fixture: trend.fixture,
          fixtureName: trend.fixtureName,
          market: trend.market,
          marketName: trend.marketName,
          competition: trend.competition,
          competitionName: trend.competitionName,
          result: trend.result,
          count: trend.count,
        };
        result.push(newItem);
      }
    });
    return result;
  }

  function getXBets(): XBet[] {
    const result = bets.map((item) => {
      return {
        ...item,
        selections: getSelections(item.selections),
      };
    });

    return result;
  }

  function filterItems() {
    const currentItems = getXBets();
    setFiltered(currentItems);
  }

  return (
    <>
      {filtered?.length > 0 ? (
        <div className="flex flex-col space-y-4">
          <div className="card flex justify-end px-4 py-2">
            <Button onClick={filterItems}>Filter</Button>
          </div>
          <div className="flex flex-col space-y-4">
            {filtered?.map((bet) => (
              <div key={bet._id.toString()} className="p-4 card">
                <Multiple bet={bet} />
              </div>
            ))}
          </div>
          {/* <div className="flex w-full justify-center items-center px-4 py-2 card">
                <PaginationComponent hasNext={hasNext} />
              </div> */}
        </div>
      ) : (
        <div className="flex flex-col space-y-3">
          <ErrorTile error="Nothing to show!" />
          <Button>Clear All Filters</Button>
        </div>
      )}
    </>
  );
}
