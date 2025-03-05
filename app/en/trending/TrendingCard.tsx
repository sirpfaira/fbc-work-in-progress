import Link from "next/link";
import ShareButton from "@/app/components/en/ShareButton";
// import StarButton from "@/app/components/common/StarButton";
import PlayButton from "@/app/components/en/PlayButton";
import { TTrending } from "@/lib/schemas/trending";
import TimeStamp from "@/app/components/common/TimeStamp";
import { Calendar, CircleDollarSign, Flame } from "lucide-react";
import { shortenNumber } from "@/lib/helpers/common";

const TrendingCard = ({ trending }: { trending: TTrending }) => {
  const {
    uid,
    fixture,
    fixtureName,
    market,
    marketName,
    competition,
    competitionName,
    date,
    result,
    count,
    value,
  } = trending;

  const textColor = result
    ? result === "won"
      ? "text-rating-top"
      : "text-rating-bottom"
    : "text-foreground";

  return (
    <div className="flex w-full flex-col items-center px-3 pb-3 text-small divide-y divide-border card">
      <div
        className={`flex flex-col w-full divide-y divide-border ${textColor}`}
      >
        <div className="flex w-full items-center justify-center space-x-2 py-1 mt-2">
          <Link
            className="block truncate px-2"
            href={`/en/trending/fixtures/${fixture}`}
          >
            <span className="font-medium">{fixtureName}</span>
          </Link>
        </div>
        <div className="flex flex-col items-center w-full py-2">
          <Link
            className="block truncate px-2"
            href={`/en/trending/markets/${market}`}
          >
            <span>{marketName}</span>
          </Link>
          <Link
            href={`/en/trending/competitions/${competition}`}
            className="block w-[100%] truncate text-center"
          >
            <span>{competitionName}</span>
          </Link>
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center justify-center">
              <Flame size={15} />
              <span>{shortenNumber(count)}</span>
            </div>
            {value > 1 && (
              <div className="flex items-center justify-center">
                <CircleDollarSign size={15} />
                <span>{value}</span>
              </div>
            )}
            <div className="flex items-center justify-center space-x-1">
              <Calendar size={15} />
              <TimeStamp date={date} />
            </div>
          </div>
        </div>
      </div>
      {!result && (
        <div className="flex flex-wrap items-center justify-center w-full gap-4 font-medium pt-3">
          {/* <StarButton uid={uid} model={Models.TRENDING} />*/}
          <PlayButton uids={[uid]} />
          <ShareButton link={`/en/trending/${uid}`} />
        </div>
      )}
    </div>
  );
};

export default TrendingCard;
