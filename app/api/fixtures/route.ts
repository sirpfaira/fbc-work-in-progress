import DatabaseConnection from "@/lib/dbconfig";
import { IFixtureSchema } from "@/lib/schemas/fixture";
import { NextRequest, NextResponse } from "next/server";
import Fixture from "@/app/api/models/Fixture";
// import fixtures from "./data.json";

export async function GET() {
  try {
    await DatabaseConnection();
    const fixtures = await Fixture.find();
    if (fixtures) {
      return NextResponse.json({ items: fixtures }, { status: 200 });
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
    const validated = IFixtureSchema.safeParse(data);
    console.log(data);
    if (validated.success) {
      await DatabaseConnection();
      const fixture = await Fixture.create(validated.data);
      if (fixture) {
        return NextResponse.json({ message: "Success!" }, { status: 200 });
      } else {
        throw new Error("Something went wrong!");
      }

      // return NextResponse.json({ message: "Success!" }, { status: 200 });
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