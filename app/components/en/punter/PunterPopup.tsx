import Link from "next/link";
import PunterAvatar from "@/app/components/common/PunterAvatar";
import IconWrapper from "@/app/components/common/IconWrapper";
import { session } from "@/lib/constants";
import {
  SquareArrowOutUpRight,
  Star,
  UserRoundCheck,
  UserRoundMinus,
  UserRoundPlus,
  UserRoundX,
} from "lucide-react";

interface PunterPopupProps {
  username: string;
  name: string;
  image: string | null;
  rating: number;
}

const PunterPopup = ({ username, name, image, rating }: PunterPopupProps) => {
  const { following, blocked } = session?.user;
  return (
    <div className="flex flex-col space-y-2 text-small">
      {name ? (
        <div className="flex space-x-3 items-center w-full py-2">
          <PunterAvatar image={image} rating={rating} size={64} />
          <div className="flex flex-col w-[75%] ">
            <div className="flex flex-col">
              <div className="block font-medium truncate">
                <span className="text-small">{`${name}`}</span>
              </div>
              <span className="text-small">{`@${username}`}</span>
              <div className="flex space-x-1 items-center">
                <span
                  className={
                    rating > 66
                      ? "text-rating-top"
                      : rating > 33
                      ? "text-rating-middle"
                      : "text-rating-bottom"
                  }
                >
                  <Star size={16} />
                </span>
                <span className="font-medium text-small">{`${rating}`}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <span className="font-medium text-small">{`@${username}`}</span>
      )}
      <hr />
      <div className="flex flex-col space-y-2 py-2 text-small w-full">
        <div className="flex items-center group menu-item w-full">
          {following?.some((user) => user === username) ? (
            <button className="flex items-center space-x-2 w-full">
              <IconWrapper>
                <UserRoundMinus size={15} />
              </IconWrapper>
              <span>Unfollow</span>
            </button>
          ) : (
            <button className="flex items-center space-x-2 w-full">
              <IconWrapper>
                <UserRoundPlus size={15} />
              </IconWrapper>
              <span>Follow</span>
            </button>
          )}
        </div>
        <div className="flex items-center group menu-item">
          {blocked?.some((user) => user === username) ? (
            <button className="flex items-center space-x-2 w-full">
              <IconWrapper>
                <UserRoundCheck size={15} />
              </IconWrapper>
              <span>Unblock</span>
            </button>
          ) : (
            <button className="flex items-center space-x-2 w-full">
              <IconWrapper>
                <UserRoundX size={15} />
              </IconWrapper>
              <span>Block</span>
            </button>
          )}
        </div>
        <Link
          href={`/en/punters/${username}`}
          className="flex items-center space-x-2 group menu-item w-full"
        >
          <IconWrapper>
            <SquareArrowOutUpRight size={18} />
          </IconWrapper>
          <span>View Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default PunterPopup;
