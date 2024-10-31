import { NextRequest, NextResponse } from "next/server";
import { IFixtureSchema } from "@/lib/schemas/fixture";
import DatabaseConnection from "@/lib/dbconfig";
import Fixture from "@/app/api/models/Fixture";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    await DatabaseConnection();
    const fixture = await Fixture.findOne({ _id: id });

    if (fixture) {
      return NextResponse.json({ item: fixture }, { status: 200 });
    } else {
      throw new Error("Fixture not found!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const data = await request.json();
    const validated = IFixtureSchema.safeParse(data);
    console.log(data);
    console.log(validated);
    if (validated.success) {
      await DatabaseConnection();
      await Fixture.findByIdAndUpdate(id, validated.data);
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
      await Fixture.findByIdAndDelete(id);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Fixture id was not received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
