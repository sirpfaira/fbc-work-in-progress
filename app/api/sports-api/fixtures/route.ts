import { NextRequest, NextResponse } from "next/server";
import apiFixturesResponse from "./api-fixtures.json";
import { IFixture } from "@/lib/schemas/fixture";

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

export async function POST(request: NextRequest) {
  // Fetches one league at a time
  try {
    const league = await request.json();
    console.log(league);
    const result: TApiFixtureResponse = apiFixturesResponse;
    const rawFixtures = result.response;
    const fbcFixtures = getFbcFixtures(rawFixtures);
    return NextResponse.json({ items: fbcFixtures }, { status: 200 });
  } catch (error: any) {
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
