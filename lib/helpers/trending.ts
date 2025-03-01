import { TFixture } from "@/lib/schemas/fixture";
import { TTrending } from "@/lib/schemas/trending";
import { autoMarkets } from "@/lib/constants";
import axios from "axios";

type TResult = {
  home: number;
  away: number;
};

function splitResult(result: string | null): TResult | null {
  try {
    if (result) {
      const array = result.split(":");
      const home = Number(array[0]);
      const away = Number(array[1]);
      if (isNaN(home) || isNaN(away)) {
        return null;
      } else {
        return { home: home, away: away };
      }
    } else {
      return null;
    }
  } catch (error: any) {
    return null;
  }
}

export function getTrendingResult(
  fixture: TFixture,
  market: number
): "won" | "lost" | null {
  if (fixture && market) {
    const ftScore = splitResult(fixture.scores.fullTime);
    switch (market) {
      case 101:
        if (ftScore) {
          return ftScore.home > ftScore.away ? "won" : "lost";
        } else {
          return null;
        }
      case 102:
        if (ftScore) {
          return ftScore.home == ftScore.away ? "won" : "lost";
        } else {
          return null;
        }
      case 103:
        if (ftScore) {
          return ftScore.home < ftScore.away ? "won" : "lost";
        } else {
          return null;
        }
      case 201:
        if (ftScore) {
          return ftScore.home > 0 && ftScore.away > 0 ? "won" : "lost";
        } else {
          return null;
        }
      case 202:
        if (ftScore) {
          return ftScore.home == 0 || ftScore.away == 0 ? "won" : "lost";
        } else {
          return null;
        }
      case 301:
        if (ftScore) {
          return ftScore.home > ftScore.away || ftScore.home == ftScore.away
            ? "won"
            : "lost";
        } else {
          return null;
        }
      case 302:
        if (ftScore) {
          return ftScore.home < ftScore.away || ftScore.home == ftScore.away
            ? "won"
            : "lost";
        } else {
          return null;
        }
      case 303:
        if (ftScore) {
          return ftScore.home > ftScore.away || ftScore.home < ftScore.away
            ? "won"
            : "lost";
        } else {
          return null;
        }
      case 501:
        if (ftScore) {
          return ftScore.home + ftScore.away > 0.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 502:
        if (ftScore) {
          return ftScore.home + ftScore.away < 0.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 503:
        if (ftScore) {
          return ftScore.home + ftScore.away > 1.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 504:
        if (ftScore) {
          return ftScore.home + ftScore.away < 1.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 505:
        if (ftScore) {
          return ftScore.home + ftScore.away > 2.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 506:
        if (ftScore) {
          return ftScore.home + ftScore.away < 2.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 507:
        if (ftScore) {
          return ftScore.home + ftScore.away > 3.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 508:
        if (ftScore) {
          return ftScore.home + ftScore.away < 3.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 509:
        if (ftScore) {
          return ftScore.home + ftScore.away > 4.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 510:
        if (ftScore) {
          return ftScore.home + ftScore.away < 4.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 511:
        if (ftScore) {
          return ftScore.home + ftScore.away > 5.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 512:
        if (ftScore) {
          return ftScore.home + ftScore.away < 5.5 ? "won" : "lost";
        } else {
          return null;
        }

      case 2501:
        if (ftScore) {
          return ftScore.home > 0.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 2502:
        if (ftScore) {
          return ftScore.away > 0.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 2503:
        if (ftScore) {
          return ftScore.home < 0.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 2504:
        if (ftScore) {
          return ftScore.away < 0.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 2505:
        if (ftScore) {
          return ftScore.home > 1.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 2506:
        if (ftScore) {
          return ftScore.away > 1.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 2507:
        if (ftScore) {
          return ftScore.home < 1.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 2508:
        if (ftScore) {
          return ftScore.away < 1.5 ? "won" : "lost";
        } else {
          return null;
        }
      default:
        return null;
    }
  }
  return null;
}

export async function updateTrending(
  trending: TTrending[],
  newFixture: TFixture
) {
  const errors: string[] = [];
  try {
    if (trending && trending?.length > 0) {
      const pendingItems = trending.filter(
        (item) => item.fixture === newFixture.uid && item.result === null
      );

      if (pendingItems.length > 0) {
        for (const trend of pendingItems) {
          if (autoMarkets.includes(trend.market)) {
            const result = getTrendingResult(newFixture, trend.market);
            trend.result = result;
            const response = await axios.put(
              `/api/trending/${trend._id}`,
              trend
            );
            if (response.status != 200) {
              errors.push(`Failed to update trend ${trend.uid}`);
            }
          }
        }
      }
    }
  } catch (error: any) {
    errors.unshift(error?.message);
  }
  return errors;
}
