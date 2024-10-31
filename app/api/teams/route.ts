import DatabaseConnection from "@/lib/dbconfig";
import { ITeamSchema } from "@/lib/schemas/team";
import { NextRequest, NextResponse } from "next/server";
import Team from "@/app/api/models/Team";

export async function GET() {
  try {
    await DatabaseConnection();
    const teams = await Team.find();
    if (teams) {
      return NextResponse.json({ items: teams }, { status: 200 });
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
    const validated = ITeamSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      const team = await Team.create(validated.data);
      if (team) {
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
      await Team.deleteMany({
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
