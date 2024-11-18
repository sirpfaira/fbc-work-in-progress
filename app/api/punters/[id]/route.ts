import { NextRequest, NextResponse } from "next/server";
import { IPunterSchema } from "@/lib/schemas/punter";
import DatabaseConnection from "@/lib/dbconfig";
import Punter from "@/app/api/models/Punter";
import punters from "../data.json";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const punter = punters.find((item) => item._id === id);
    // await DatabaseConnection();
    // const punter = await Punter.findOne({ _id: id });

    if (punter) {
      return NextResponse.json({ item: punter }, { status: 200 });
    } else {
      throw new Error("Punter not found!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const data = await request.json();
    const validated = IPunterSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      await Punter.findByIdAndUpdate(id, validated.data);
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
      await Punter.findByIdAndDelete(id);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Punter id was not received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
