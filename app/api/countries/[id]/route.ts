import { NextRequest, NextResponse } from "next/server";
import { ICountrySchema } from "@/lib/schemas/country";
import DatabaseConnection from "@/lib/dbconfig";
import Country from "@/app/api/models/Country";
import countries from "../countries.json";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;

    const country = countries.find((item) => item._id == id);
    // await DatabaseConnection();
    // const country = await Country.findOne({ _id: id });

    if (country) {
      return NextResponse.json({ item: country }, { status: 200 });
    } else {
      throw new Error("Country not found!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const data = await request.json();
    const validated = ICountrySchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      await Country.findByIdAndUpdate(id, validated.data);
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
      await Country.findByIdAndDelete(id);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Country id was not received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
