import { NextRequest, NextResponse } from "next/server";
import { ITeamSchema } from "@/lib/schemas/team";
import DatabaseConnection from "@/lib/dbconfig";
import Team from "@/app/api/models/Team";
import teams from "../teams.json";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const team = teams.find((item) => item._id == id);
    // await DatabaseConnection();
    // const team = await Team.findOne({ _id: id });
    if (team) {
      return NextResponse.json({ item: team }, { status: 200 });
    } else {
      throw new Error("Team not found!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const data = await request.json();
    const validated = ITeamSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      await Team.findByIdAndUpdate(id, validated.data);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Invalid data!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const { id } = params;

    if (id) {
      await DatabaseConnection();
      await Team.findByIdAndDelete(id);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Team id was not received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
