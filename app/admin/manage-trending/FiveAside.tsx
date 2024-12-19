"use client";
import ErrorTile from "@/app/components/common/ErrorTile";
import TrendingCard from "@/app/en/trending/TrendingCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TTrending } from "@/lib/schemas/trending";
import moment from "moment";

interface MarketTrending {
  [country: string]: TTrending[];
}

interface FiveAsideProps {
  trendings: TTrending[];
}

export default function FiveAside({ trendings }: FiveAsideProps) {
  const upcomingTrendings = trendings
    ?.sort((a, b) => moment(b.date).diff(moment(a.date)))
    ?.filter((item) =>
      moment(item.date).isAfter(moment().subtract(10, "minute").utc())
    );

  const topTrendingMarkets: MarketTrending = upcomingTrendings.reduce(
    (acc: MarketTrending, obj: TTrending) => {
      if (!acc[obj.marketName]) {
        acc[obj.marketName] = [];
      }
      acc[obj.marketName].push(obj);
      return acc;
    },
    {}
  );

  for (const market in topTrendingMarkets) {
    topTrendingMarkets[market] = topTrendingMarkets[market].sort(
      (a, b) => b.count - a.count
    ); //   .slice(0, 5);
  }
  const entries = Object.entries(topTrendingMarkets);

  return (
    <div className="flex flex-col space-y-4">
      {entries?.length > 0 ? (
        <>
          {entries?.map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col px-3 border border-border rounded-md bg-muted"
            >
              <Accordion type="single" collapsible>
                <AccordionItem value={key}>
                  <AccordionTrigger>
                    <div className="flex justify-center items-center space-x-2">
                      <span>{`${key}`}</span>
                      <span className="flex items-center justify-center text-smaller px-[7px] bg-primary rounded-full">
                        {value.length}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-4">
                      {value
                        .sort((a, b) =>
                          a.date > b.date ? 1 : b.date > a.date ? -1 : 0
                        )
                        .map((item) => (
                          <TrendingCard
                            key={item._id.toString()}
                            trending={item}
                          />
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </>
      ) : (
        <ErrorTile error="Nothing to show!" />
      )}
    </div>
  );
}
