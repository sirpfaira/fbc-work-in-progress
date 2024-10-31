import DatabaseConnection from "@/lib/dbconfig";
import { ICompetitionSchema } from "@/lib/schemas/competition";
import { NextRequest, NextResponse } from "next/server";
import Competition from "@/app/api/models/Competition";

export async function GET() {
  try {
    await DatabaseConnection();
    const competitions = await Competition.find();
    if (competitions) {
      return NextResponse.json({ items: competitions }, { status: 200 });
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
    const validated = ICompetitionSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      const competition = await Competition.create(validated.data);
      if (competition) {
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
      await Competition.deleteMany({
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
