import PunterTile from "@/app/components/en/punter/PunterTile";
import { session } from "@/lib/constants";
import { IPunter } from "@/lib/schemas/punter";
import { UserRoundMinus, UserRoundPlus } from "lucide-react";

const Suggestion = ({ punter, size }: { punter: IPunter; size: number }) => {
  const { username } = punter;
  const { following } = session?.user;
  return (
    <div className="relative w-full gap-2 justify-between items-center">
      <div className="w-full">                       
        <PunterTile punter={punter} size={size} />
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
};

export default Suggestion;
