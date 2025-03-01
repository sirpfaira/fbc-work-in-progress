import Link from "next/link";
import ShareButton from "@/app/components/en/ShareButton";
// import StarButton from "@/app/components/en/StarButton";
import PlayButton from "@/app/components/en/PlayButton";
import { ITrending } from "@/lib/schemas/trending";
import TimeStamp from "@/app/components/common/TimeStamp";
import { shortenNumber } from "@/lib/helpers/common";
import { CircleDollarSign, Flame } from "lucide-react";

const Single = ({ selection }: { selection: ITrending }) => {
  const {
    uid,
    fixtureName,
    competitionName,
    marketName,
    date,
    result,
    value,
    count,
  } = selection;

  const textColor = result
    ? result === "won"
      ? "text-rating-top"
      : "text-rating-bottom"
    : "text-foreground";

  return (
    <div className="relative pb-3 pt-2">
      <div className={`flex flex-col w-full ${textColor}`}>
        <Link href={`/en/fixtures/${uid?.split("-")[0]}`}>{fixtureName}</Link>
        <span className="font-medium">{marketName}</span>
        <div className="block w-[100%] truncate">
          <span>{competitionName}</span>
        </div>
        <TimeStamp date={date} />
      </div>
      <div className="flex items-center justify-between pt-1.5 space-x-2 text-muted-foreground text-small">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Flame size={15} />
            <span>{shortenNumber(count)}</span>
          </div>
          {value > 1 && (
            <div className="flex items-center justify-center">
              <CircleDollarSign size={15} />
              <span>{value}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!result && (
            <>
              {/* <StarButton uid={uid} model={Models.TRENDING} /> */}
              <PlayButton uids={[uid]} />
            </>
          )}
          <ShareButton link={`/en/trending/${uid}`} />
        </div>
      </div>
    </div>
  );
};

export default Single;
