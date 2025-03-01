import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PunterAvatar from "@/app/components/common/PunterAvatar";
import PunterPopup from "@/app/components/en/punter/PunterPopup";
import { IPunter } from "@/lib/schemas/punter";
import axios from "axios";
import { TTrending } from "@/lib/schemas/trending";
import { useQuery } from "@tanstack/react-query";
import { getPunterRating } from "@/lib/helpers/punter";
import ErrorsTile from "@/app/components/common/ErrorsTile";
import TableSkeleton from "../../common/LoadingSkeletons";

const PunterTile = ({ punter, size }: { punter: IPunter; size: number }) => {
  const {
    data: trending,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/trending`);
      return data.items as TTrending[];
    },
  });
  const { username, name, image, form } = punter;
  if (isError) return <ErrorsTile errors={[error.message]} />;

  return (
    <div className="flex flex-col space-y-5">
      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <>
          {trending && (
            <Popover>
              <PopoverTrigger>
                <div className="flex space-x-3 items-center w-full">
                  <PunterAvatar
                    image={image}
                    rating={getPunterRating(form, trending)}
                    size={size}
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
                  rating={getPunterRating(form, trending)}
                />
              </PopoverContent>
            </Popover>
          )}
        </>
      )}
    </div>
  );
};

export default PunterTile;
