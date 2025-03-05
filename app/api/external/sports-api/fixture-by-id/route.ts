import { IFixture } from "@/lib/schemas/fixture";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const fixtureId = request.nextUrl.searchParams.get("fixture");
    if (fixtureId) {
      const apiURL = `https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}&half=true`;
      const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY as string;

      let fixtures: IFixture[] = [];

      await fetch(apiURL, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-apisports-key": API_FOOTBALL_KEY,
        },
      })
        .then(async (res: any) => {
          const response = await res.json();
          if ("response" in response) {
            const result: TApiFixtureResponse = response;
            const rawFixtures = result.response;
            if (rawFixtures && rawFixtures?.length > 0) {
              const fbcFixtures: IFixture[] = getFbcFixtures(
                fixtureId,
                rawFixtures
              );
              fixtures = [...fbcFixtures];
            } else {
              throw new Error("Invalid response from Sports API!");
            }
          } else {
            throw new Error("Invalid response from Sports API!");
          }
        })
        .catch((err: any) => {
          throw new Error(`API Connection Error: ${err?.message}`);
        });
      return NextResponse.json({ items: fixtures }, { status: 200 });
    } else {
      throw new Error("No fixture ID was received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

const getResult = (
  homeResult: string | number | null,
  awayResult: string | number | null
) => {
  if (homeResult !== null && awayResult !== null) {
    return `${homeResult}:${awayResult}`;
  }
  return null;
};

const getFixture = (fixtureId: string, rawFixtures: RawFixture[]) => {
  const home: RawFixture = rawFixtures[0];
  const away: RawFixture = rawFixtures[1];
  const fixture: IFixture = {
    uid: Number(fixtureId) || 0,
    date: "",
    status: "",
    competition: 0,
    competitionName: "",
    teams: home.team.name + " v " + away.team.name,
    homeTeam: home.team.id,
    awayTeam: away.team.id,
    scores: {
      tenMinutes: null,
      halfTime: null,
      fullTime: null,
      extraTime: null,
      penalties: null,
    },
    corners: {
      halfTime: getResult(
        home.statistics_1h.find((el) => el.type === "Corner Kicks")?.value!,
        away.statistics_1h.find((el) => el.type === "Corner Kicks")?.value!
      ),
      fullTime: getResult(
        home.statistics.find((el) => el.type === "Corner Kicks")?.value!,
        away.statistics.find((el) => el.type === "Corner Kicks")?.value!
      ),
    },
    bookings: {
      halfTime: null,
      fullTime: null,
    },
    odds: [],
  };
  return fixture;
};

const getFbcFixtures = (fixtureId: string, rawFixtures: RawFixture[]) => {
  const fixtures: IFixture[] = [];
  if (rawFixtures.length > 1) {
    const fixture = getFixture(fixtureId, rawFixtures);
    if (fixture) {
      fixtures.push(fixture);
    }
  }
  return fixtures;
};

interface TApiFixtureResponse {
  get: string;
  parameters: {
    league: string;
    season: string;
    from: string;
    to: string;
  };
  errors: unknown[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: RawFixture[];
}

export interface RawFixture {
  team: Team;
  statistics: Statistic[];
  statistics_1h: Statistic[];
  statistics_2h: Statistic[];
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Statistic {
  type: string;
  value: number | string | null;
}
