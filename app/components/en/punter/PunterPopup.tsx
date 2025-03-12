import Link from "next/link";
import PunterAvatar from "@/app/components/common/PunterAvatar";
import IconWrapper from "@/app/components/common/IconWrapper";
import { session } from "@/lib/constants";
import {
  SquareArrowOutUpRight,
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
                      : rating >= 0
                      ? "text-rating-bottom"
                      : "text-border"
                  }
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 576 512"
                    height="1.1em"
                    width="1.1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                  </svg>
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
          <span>View profile</span>
        </Link>
      </div>
    </div>
  );
};

export default PunterPopup;
