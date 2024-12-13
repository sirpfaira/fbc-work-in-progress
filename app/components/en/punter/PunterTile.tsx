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
import { getPunterRating } from "@/lib/helpers";
import ErrorTile from "@/app/components/common/ErrorTile";
import TableSkeleton from "../../common/LoadingSkeletons";

const PunterTile = ({ punter, size }: { punter: IPunter; size: number }) => {
  const {
    data: trendings,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["trendings"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/trendings`);
      return data.items as TTrending[];
    },
  });
  const { username, name, image, form } = punter;
  if (isError) return <ErrorTile error={error.message} />;

  return (
    <div className="flex flex-col space-y-5">
      {isLoading ? (
        <TableSkeleton columns={3} />
      ) : (
        <>
          {trendings && (
            <Popover>
              <PopoverTrigger>
                <div className="flex space-x-3 items-center w-full">
                  <PunterAvatar
                    image={image}
                    rating={getPunterRating(form, trendings)}
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
                  rating={getPunterRating(form, trendings)}
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
