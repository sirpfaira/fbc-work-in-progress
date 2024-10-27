import { NextRequest, NextResponse } from "next/server";
import { ICompetitionSchema } from "@/lib/schemas/competition";
import DatabaseConnection from "@/lib/dbconfig";
import Competition from "@/app/api/models/Competition";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    await DatabaseConnection();
    const competition = await Competition.findOne({ _id: id });

    if (competition) {
      return NextResponse.json({ item: competition }, { status: 200 });
    } else {
      throw new Error("Competition not found!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const data = await request.json();
    const validated = ICompetitionSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      await Competition.findByIdAndUpdate(id, validated.data);
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
      await Competition.findByIdAndDelete(id);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Competition id was not received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
