import { NextRequest, NextResponse } from "next/server";
import { IPlatformSchema } from "@/lib/schemas/platform";
import DatabaseConnection from "@/lib/dbconfig";
import Platform from "@/app/api/models/Platform";
import platforms from "../platforms.json";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const platform = platforms.find((item) => item._id == id);
    // await DatabaseConnection();
    // const platform = await Platform.findOne({ _id: id });

    if (platform) {
      return NextResponse.json({ item: platform }, { status: 200 });
    } else {
      throw new Error("Platform not found!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const data = await request.json();
    const validated = IPlatformSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      await Platform.findByIdAndUpdate(id, validated.data);
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
      await Platform.findByIdAndDelete(id);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Platform id was not received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
