import { NextRequest, NextResponse } from "next/server";
import { ITrendingSchema } from "@/lib/schemas/trending";
import DatabaseConnection from "@/lib/dbconfig";
import Trending from "@/app/api/models/Trending";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    await DatabaseConnection();
    const trending = await Trending.findOne({ _id: id });

    if (trending) {
      return NextResponse.json({ item: trending }, { status: 200 });
    } else {
      throw new Error("Trending not found!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const data = await request.json();
    const validated = ITrendingSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      await Trending.findByIdAndUpdate(id, validated.data);
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
      await Trending.findByIdAndDelete(id);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Trending id was not received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
