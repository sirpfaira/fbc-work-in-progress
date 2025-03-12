"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserRoundMinus, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import avatar from "@/app/components/common/avatar.png";
import { BUser } from "@/lib/schemas/bet";
import { session } from "@/lib/constants";
import PunterPopup from "@/app/components/en/punter/PunterPopup";
import { TTrending } from "@/lib/schemas/trending";
import { getPunterRating } from "@/lib/helpers/punter";

type UserTileProps = { user: BUser; size: number; trending: TTrending[] };

export default function UserTile({ user, size, trending }: UserTileProps) {
  const { username, name, image, form } = user;
  const { following } = session?.user;
  const rating = getPunterRating(form, trending);

  return (
    <div className="relative w-full gap-2 justify-between items-center">
      <div className="w-full">
        <Popover>
          <PopoverTrigger>
            <div className="flex space-x-3 items-center w-full">
              <Image
                className={`rounded-full ring-2 p-1 ${
                  rating > 66
                    ? "ring-rating-top"
                    : rating > 33
                    ? "ring-rating-middle"
                    : rating >= 0
                    ? "ring-rating-bottom"
                    : "ring-border"
                }`}
                width={0}
                height={0}
                sizes="100vw"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  objectFit: "cover",
                }}
                src={user.image || avatar}
                alt="User photo"
              />
              <div className="flex flex-col overflow-hidden max-w-[250px] sm:max-w-[300px]">
                <div className="block font-medium truncate">
                  <span>{name}</span>
                </div>
                <div className="flex w-full">
                  <span className="text-small">{`@${username}`}</span>
                </div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[350px]">
            <PunterPopup
              username={username}
              name={name}
              image={image}
              rating={rating}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="absolute right-0 top-2 font-medium text-primary justify-center rounded-md p-2 hover:bg-muted">
        {!following?.some((user: string) => user === username) && (
          <button>
            <UserRoundPlus size={20} />
          </button>
        )}
        {following?.some((user: string) => user === username) && (
          <button>
            <UserRoundMinus size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
