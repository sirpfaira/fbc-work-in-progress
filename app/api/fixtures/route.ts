import DatabaseConnection from "@/lib/dbconfig";
import { IFixtureSchema } from "@/lib/schemas/fixture";
import { NextRequest, NextResponse } from "next/server";
import Fixture from "@/app/api/models/Fixture";
import moment from "moment";
// import fixtures from "./fixtures.json";

export async function GET(request: NextRequest) {
  try {
    const filter = request.nextUrl.searchParams.get("filter");
    await DatabaseConnection();
    if (filter === "all") {
      const fixtures = await Fixture.find();
      return NextResponse.json({ items: fixtures }, { status: 200 });
    } else {
      const upcomingFixtures = await Fixture.find({
        date: { $gte: moment(), $lte: moment().add(7, "days") },
      });
      // const upcomingFixtures = fixtures.filter((item) =>
      //   moment(item.date).isAfter(moment())
      // );
      return NextResponse.json({ items: upcomingFixtures }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validated = IFixtureSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      const fixture = await Fixture.create(validated.data);
      if (fixture) {
        return NextResponse.json({ message: "Success!" }, { status: 200 });
      } else {
        throw new Error("Something went wrong!");
      }
    } else {
      throw new Error("Invalid data!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    if (data) {
      await DatabaseConnection();
      await Fixture.deleteMany({
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
