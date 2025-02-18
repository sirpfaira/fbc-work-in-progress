import { NextRequest, NextResponse } from "next/server";
// import apiFixturesResponse from "./api-fixtures.json";
import { IFixture, ILeagueSchema } from "@/lib/schemas/fixture";
import moment from "moment";

interface RawFixture {
  fixture: {
    id: number | null;
    referee: string | null;
    timezone: string | null;
    date: string | null;
    timestamp: number | null;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
    status: {
      long: string | null;
      short: string | null;
      elapsed: number | null;
    };
  };
  league: {
    id: number | null;
    name: string | null;
    country: string | null;
    logo: string | null;
    flag: string | null;
    season: number | null;
    round: string | null;
  };
  teams: {
    home: {
      id: number | null;
      name: string | null;
      logo: string | null;
      winner: boolean | null;
    };
    away: {
      id: number | null;
      name: string | null;
      logo: string | null;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

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

// {
//   uid: 135,
//   name: 'Serie A',
//   season: 2024,
//   date: '2024-12-13T19:45:00.000Z',
//   count: 34,
//   auto: 12,
//   fetched: true
// }

export async function POST(request: NextRequest) {
  // Fetches one league at a time
  try {
    const league = await request.json();
    const validated = ILeagueSchema.safeParse(league);
    console.log(validated);
    if (validated.success) {
      const league = validated.data.uid;
      const season = validated.data.season;
      const date = moment(validated.data.date);
      const from = date.format("YYYY-MM-DD");
      const to = date.add(14, "days").format("YYYY-MM-DD");

      const baseURL = "https://v3.football.api-sports.io/fixtures";
      const { API_FOOTBALL_KEY } = process.env;

      // `${baseURL}?league=${league}&season=${season}&from=${from}&to=${to}`,

      await fetch(`${baseURL}?league=${league}&season=${season}&date=${from}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-apisports-key": `394de5473ecfff90cf3b0a7319731757`,
        },
      })
        .then(async (res: any) => {
          const response = await res.json();
          // console.log(response);
          if ("response" in response) {
            const result: TApiFixtureResponse = response;
            const rawFixtures = result.response;
            if (rawFixtures && rawFixtures?.length > 0) {
              const fbcFixtures = getFbcFixtures(rawFixtures);
              return NextResponse.json({ items: fbcFixtures }, { status: 200 });
            } else {
              throw new Error("No fixtures fetched!");
            }
          }
        })
        .catch((err: any) => {
          console.log(err);
          throw new Error("API Connection Error!", err?.message);
        });

      return NextResponse.json("Success!", { status: 200 });
    } else {
      throw new Error("Invalid data!");
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

const getResult = (homeResult: number | null, awayResult: number | null) => {
  if (homeResult !== null && awayResult !== null) {
    return `${homeResult}:${awayResult}`;
  }
  return null;
};

const getFixture = (rawFixture: RawFixture) => {
  if (rawFixture) {
    const fixture: IFixture = {
      uid: rawFixture.fixture.id || 9999,
      date: rawFixture.fixture.date || "",
      status: rawFixture.fixture.status.long || "",
      competition: rawFixture.league.id || 9999,
      competitionName: rawFixture.league.name || "No competition",
      teams: rawFixture.teams.home.name + " v " + rawFixture.teams.away.name,
      homeTeam: rawFixture.teams.home.id || 9999,
      awayTeam: rawFixture.teams.away.id || 9999,
      scores: {
        tenMinutes: null,
        halfTime: getResult(
          rawFixture.score.halftime.home,
          rawFixture.score.halftime.away
        ),
        fullTime: getResult(
          rawFixture.score.fulltime.home,
          rawFixture.score.fulltime.away
        ),
        extraTime: getResult(
          rawFixture.score.extratime.home,
          rawFixture.score.extratime.away
        ),
        penalties: getResult(
          rawFixture.score.penalty.home,
          rawFixture.score.penalty.away
        ),
      },
      corners: {
        halfTime: null,
        fullTime: null,
      },
      bookings: {
        halfTime: null,
        fullTime: null,
      },
      odds: [],
    };
    return fixture;
  } else {
    return null;
  }
};

const getFbcFixtures = (rawFixtures: RawFixture[]) => {
  const fixtures: IFixture[] = [];
  for (const x in rawFixtures) {
    const fixture = getFixture(rawFixtures?.[x]);
    if (fixture) {
      fixtures.push(fixture);
    }
  }
  return fixtures;
};
