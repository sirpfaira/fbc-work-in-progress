"use client";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import TrendingCard from "@/app/en/trending/TrendingCard";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import { TTrending } from "@/lib/schemas/trending";
import moment from "moment";

const TrendPeriodOptions = [
  { value: "finished", label: "Finished" },
  { value: "upcoming", label: "Upcoming" },
];

interface TrendingProps {
  trending: TTrending[];
}

export default function Trending({ trending }: Readonly<TrendingProps>) {
  const [filtered, setFiltered] = useState<TTrending[]>(trending);
  const [period, setPeriod] = useState<string>("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filtered.length / itemsPerPage);

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected + 1);
  };

  useEffect(() => {
    let result: TTrending[] = [];
    if (period === "finished") {
      result = trending
        ?.sort((a, b) => moment(b.date).diff(moment(a.date)))
        ?.filter((item) => moment(item.date).isBefore(moment().utc()));
    } else {
      result = trending
        ?.sort((a, b) => moment(b.date).diff(moment(a.date)))
        ?.filter((item) => moment(item.date).isAfter(moment().utc()));
    }
    setFiltered(result);
  }, [period, trending]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <div className="flex flex-col space-y-5">
      <div className="flex justify-between items-center px-4 py-2 card text-small">
        <div className="flex space-x-3">
          {TrendPeriodOptions?.map((option, index) => (
            <button
              key={`${option.value}-${index}`}
              onClick={() => {
                setPeriod(option.value);
              }}
              className={`${
                period === option.value
                  ? "text-primary-foreground bg-primary"
                  : "text-muted-foreground bg-muted"
              } py-1 px-2 rounded-md font-medium`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {/* <DatePicker date={date} /> */}
      </div>
      {currentItems?.length > 0 ? (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-4">
            {currentItems?.map((item) => (
              <div key={item._id.toString()}>
                <TrendingCard trending={item} />
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
        <ErrorsTile errors={[`Nothing to show!`]} />
      )}
    </div>
  );
}
