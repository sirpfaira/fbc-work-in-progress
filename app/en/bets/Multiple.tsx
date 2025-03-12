import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Single from "@/app/en/bets/Single";
import PunterPopup from "@/app/components/en/punter/PunterPopup";
import { XBet } from "@/lib/schemas/bet";
import {
  ChevronDown,
  ChevronsUpDown,
  CircleDollarSign,
  CodeXml,
  Copy,
  Layers,
  Share,
  TriangleAlert,
  User,
} from "lucide-react";
import IconWrapper from "@/app/components/common/IconWrapper";
import UserTile from "./UserTile";
import { TTrending } from "@/lib/schemas/trending";
// import LikeButton from "@/app/components/common/LikeButton";
// import DislikeButton from "@/app/components/common/DislikeButton";
// import StarButton from "@/app/components/common/StarButton";
// import PlayButton from "@/app/components/common/PlayButton";
// import ShareButton from "@/app/components/common/ShareButton";

const Multiple = ({ bet, trending }: { bet: XBet; trending: TTrending[] }) => {
  const { user, title, selections, codes } = bet;
  return (
    <div className="flex flex-col w-full">
      <div className="mt-2">
        <UserTile user={user} size={54} trending={trending} />
      </div>

      <details className="group">
        <summary className="py-3 flex justify-between items-center font-medium cursor-pointer list-none text-subtext focus:outline-none">
          <div className={`flex flex-col w-[80%] items-baseline`}>
            <div className="block truncate w-full pb-1">
              <span className="px-1.5">{title}</span>
            </div>
            <div className={`flex space-x-5`}>
              {selections?.length > 0 && (
                <div className="flex items-center">
                  <div className="flex space-x-1 items-center ml-1">
                    <Layers size={16} />
                    <p>{`${selections.length} `}</p>
                  </div>
                  <div className="flex space-x-1 items-center ml-5">
                    <CircleDollarSign size={16} />
                    <span>1.56</span>
                  </div>
                </div>
              )}
              {codes?.length > 0 && (
                <div className="flex space-x-1 items-center ml-1">
                  <CodeXml size={16} />
                  <p>{`${codes.length}`}</p>
                </div>
              )}
            </div>
          </div>
          <div className="transition -rotate-90 group-open:rotate-180 px-2">
            <ChevronDown size={16} />
          </div>
        </summary>
        <div className="w-full text-small mt-3 group-open:animate-fadeIn">
          {selections?.length > 0 && (
            <div className="w-full border border-border rounded-md pt-2 px-2 group-open:mt-5">
              <div className="flex flex-col divide-y divide-border p-2">
                <div className="w-full text-standard font-medium">
                  <span>Selections</span>
                </div>
                {selections?.slice(0, 5).map((selection) => (
                  <div key={selection.uid}>
                    <Single selection={selection} />
                  </div>
                ))}
                {selections?.length > 5 && (
                  <details className="group">
                    <summary className="flex space-x-1 mt-2 items-center text-primary font-medium cursor-pointer list-none focus:outline-none">
                      <ChevronsUpDown size={16} />
                      <span>Show All</span>
                    </summary>
                    <div className="w-full text-small mt-1 group-open:animate-fadeIn">
                      {selections
                        ?.slice(5, selections?.length)
                        .map((selection) => (
                          <Single key={selection.uid} selection={selection} />
                        ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          )}
          {codes?.length > 0 && (
            <div className="w-full border border-border rounded-md pt-2 px-2 group-open:mt-5">
              <div className="flex flex-col divide-y divide-border p-2">
                <div className="w-full text-standard font-medium">
                  <span>Codes</span>
                </div>
                {codes?.map((code) => (
                  <div
                    key={`${code.username}-${code.value}`}
                    className="flex flex-col py-2 text-subtext text-small"
                  >
                    <span>{code.platform.replaceAll("_", " ")}</span>
                    <div className="flex flex-wrap items-center space-x-3 space-y-1">
                      <Popover>
                        <PopoverTrigger>
                          <div
                            className={`flex items-center space-x-2 bg-muted rounded-md px-3 py-1 text-small`}
                          >
                            <User size={16} />
                            <span>{`${code.username}`}</span>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PunterPopup
                            username={user.username}
                            image={user.image}
                            rating={66}
                            name="To be populated"
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger>
                          <div
                            className={`flex items-center space-x-2 bg-muted rounded-md px-3 py-1`}
                          >
                            <span>{code.value}</span>
                            {code?.flagged?.length > 0 && (
                              <div className="text-yellow-500">
                                <TriangleAlert size={16} />
                              </div>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent>
                          <span className="font-medium text-small">{`${code.value}`}</span>
                          <hr />
                          <div className="flex flex-col items-start space-y-1 text-small py-1.5">
                            <button className="flex items-center space-x-2 group menu-item">
                              <IconWrapper>
                                <Copy size={16} />
                              </IconWrapper>
                              <span>Copy</span>
                            </button>
                            <button className="flex items-center space-x-2 group menu-item">
                              <IconWrapper>
                                <Share size={16} />
                              </IconWrapper>
                              <span>Share</span>
                            </button>
                            <button className="flex items-center space-x-2 group menu-item">
                              <IconWrapper>
                                <TriangleAlert size={16} />
                              </IconWrapper>
                              <span>Flag As Invalid</span>
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </details>

      {/* <div className="flex flex-wrap items-center w-full py-3 gap-4 text-subtext font-medium">
        <LikeButton uid={uid} boom={boom} model={Models.BET} />
        <DislikeButton uid={uid} doom={doom} model={Models.BET} />
        {selections?.length > 0 && (
          <>
            <StarButton uid={uid} model={Models.BET} />
            <PlayButton uids={selections?.map((i: Selection) => i.uid)} />
          </>
        )}
        <ShareButton uid={uid} />
      </div> */}
    </div>
  );
};

export default Multiple;
