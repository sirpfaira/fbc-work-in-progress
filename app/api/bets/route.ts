import DatabaseConnection from "@/lib/dbconfig";
import { CBet, CBetSchema, IBet, ISelection } from "@/lib/schemas/bet";
import { NextRequest, NextResponse } from "next/server";
import Bet from "@/app/api/models/Bet";
import { getShortDate } from "@/lib/helpers/common";
import Trending from "@/app/api/models/Trending";
import { ITrending, TTrending } from "@/lib/schemas/trending";
import Punter from "@/app/api/models/Punter";
import bets from "./bets.json";

export async function GET() {
  try {
    // await DatabaseConnection();
    // const bets = await Bet.find().populate({
    //   path: "user",
    //   model: "Punter",
    //   select: "name form image",
    //   foreignField: "username",
    // });
    if (bets) {
      return NextResponse.json({ items: bets }, { status: 200 });
    } else {
      throw new Error("Something went wrong!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validated = CBetSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      const newBet = validated.data;
      const selections = validateSelections(newBet.selections);
      if (selections.length > 0 || newBet.codes.length > 0) {
        newBet.selections = selections;
        const databaseBet = createBet(newBet);
        const bet = await Bet.create(databaseBet);
        if (bet && selections.length > 0) {
          const trending: TTrending[] = await Trending.find();
          const newTrends: ITrending[] = [];
          const oldTrends: TTrending[] = [];
          const formTrends: string[] = [];

          selections.map((item) => {
            const trend = trending.find(
              (element) =>
                element.fixture === item.fixture &&
                element.market === item.market
            );
            if (trend) {
              const updatedTrend: TTrending = {
                _id: trend._id,
                date: trend.date,
                result: trend.result,
                uid: trend.uid,
                value: trend.value,
                fixture: trend.fixture,
                fixtureName: trend.fixtureName,
                market: trend.market,
                marketName: trend.marketName,
                competition: trend.competition,
                competitionName: trend.competitionName,
                count: trend.count + 1,
              };
              oldTrends.push(updatedTrend);
              formTrends.push(trend.uid);
            } else {
              const newTrend: ITrending = {
                uid: `${item.fixture}-${item.market}-${getShortDate(
                  item.date
                )}`,
                fixture: item.fixture,
                fixtureName: item.fixtureName,
                market: item.market,
                marketName: item.marketName,
                competition: item.competition,
                competitionName: item.competitionName,
                date: item.date,
                result: null,
                count: 1,
                value: item.value,
              };
              newTrends.push(newTrend);
              formTrends.push(newTrend.uid);
            }
          });

          await Trending.insertMany(newTrends);

          for (const item of oldTrends) {
            await Trending.findByIdAndUpdate(item._id, item);
          }

          await Punter.updateOne(
            { username: newBet.user },
            { $addToSet: { form: { $each: formTrends } } }
          );

          return NextResponse.json({ message: "Success!" }, { status: 200 });
        } else {
          throw new Error("Something went wrong!");
        }
      } else {
        throw new Error("Fixtures already in progress!");
      }
    } else {
      throw new Error("Invalid data!");
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    if (data) {
      await DatabaseConnection();
      await Bet.deleteMany({
        _id: { $in: data },
      });
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Invalid data!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

function createBet(bet: CBet): IBet {
  const selections: string[] = bet.selections?.map((item) => {
    return `${item.fixture}-${item.market}-${getShortDate(item.date)}`;
  });
  const databaseItem: IBet = {
    uid: `${bet.user}-${getShortDate(new Date().toISOString())}`,
    user: bet.user,
    title: bet.title,
    date: new Date().toISOString(),
    boom: [],
    doom: [],
    selections: selections,
    codes: bet.codes,
  };
  return databaseItem;
}

function validateSelections(selections: ISelection[]): ISelection[] {
  const newSelections: ISelection[] = [];
  selections.map((item) => {
    const date = new Date(item.date);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = diffInMs / (1000 * 60);
    if (diffInMins <= 0) newSelections.push(item);
  });
  return newSelections;
}
