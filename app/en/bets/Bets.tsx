import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Multiple from "@/app/en/bets/Multiple";
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected + 1);
  };

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
      {currentItems?.length > 0 ? (
        <div className="flex flex-col space-y-4">
          <div className="card flex justify-end px-4 py-2">
            <Button onClick={filterItems}>Filter</Button>
          </div>
          <div className="flex flex-col space-y-4">
            {currentItems?.map((bet) => (
              <div key={bet._id.toString()} className="p-4 card">
                <Multiple bet={bet} />
              </div>
            ))}
          </div>
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
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