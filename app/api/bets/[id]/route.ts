import { NextRequest, NextResponse } from "next/server";
import { IBetSchema } from "@/lib/schemas/bet";
import DatabaseConnection from "@/lib/dbconfig";
import Bet from "@/app/api/models/Bet";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    await DatabaseConnection();
    const bet = await Bet.findOne({ _id: id });

    if (bet) {
      return NextResponse.json({ item: bet }, { status: 200 });
    } else {
      throw new Error("Bet not found!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const data = await request.json();
    const validated = IBetSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      await Bet.findByIdAndUpdate(id, validated.data);
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
      await Bet.findByIdAndDelete(id);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Bet id was not received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
