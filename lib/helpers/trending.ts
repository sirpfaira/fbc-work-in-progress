import axios from "axios";
import { TFixture } from "@/lib/schemas/fixture";
import { TTrending } from "@/lib/schemas/trending";
import { scoresMarkets, statisticsMarkets } from "@/lib/constants";
import { isFixtureFinished } from "@/lib/helpers/fixture";

type TResult = {
  home: number;
  away: number;
};

type FResult = "won" | "lost" | null;

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
    console.log(error?.message);
    return null;
  }
}

export function getTrendingResult(fixture: TFixture, market: number): FResult {
  if (fixture && market) {
    const ftScore = splitResult(fixture.scores.fullTime);
    const ftCorners = splitResult(fixture.corners.fullTime);
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
      case 1001:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away > 5.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1002:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away < 5.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1003:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away > 6.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1004:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away < 6.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1005:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away > 7.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1006:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away < 7.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1007:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away > 8.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1008:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away < 8.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1009:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away > 9.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1010:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away < 9.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1011:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away > 10.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1012:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away < 10.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1013:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away > 11.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1014:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away < 11.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1015:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away > 12.5 ? "won" : "lost";
        } else {
          return null;
        }
      case 1016:
        if (ftCorners) {
          return ftCorners.home + ftCorners.away < 12.5 ? "won" : "lost";
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
  newFixture: TFixture,
  mode: "scores" | "statistics" | "events"
) {
  const errors: string[] = [];
  try {
    if (trending && trending?.length > 0) {
      const pendingItems = trending.filter(
        (item) =>
          item.fixture === newFixture.uid &&
          item.result === null &&
          isFixtureFinished(item.date)
      );

      if (pendingItems.length > 0) {
        for (const trend of pendingItems) {
          let result: FResult = null;
          if (mode === "scores") {
            if (scoresMarkets.includes(trend.market)) {
              result = getTrendingResult(newFixture, trend.market);
            }
          } else if (mode === "statistics") {
            if (statisticsMarkets.includes(trend.market)) {
              result = getTrendingResult(newFixture, trend.market);
            }
          }

          trend.result = result;
          const response = await axios.put(`/api/trending/${trend._id}`, trend);
          if (response.status != 200) {
            errors.push(`Failed to update trend ${trend.uid}`);
          }
        }
      }
    }
  } catch (error: any) {
    errors.unshift(error?.message);
  }
  return errors;
}
