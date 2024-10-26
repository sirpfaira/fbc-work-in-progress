import DatabaseConnection from "@/lib/dbconfig";
import { ICountrySchema } from "@/lib/schemas/country";
import { NextRequest, NextResponse } from "next/server";
import Country from "@/app/api/models/Country";
// import countries from "./data.json";

export async function GET() {
  try {
    await DatabaseConnection();
    const countries = await Country.find();
    if (countries) {
      return NextResponse.json({ items: countries }, { status: 200 });
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
    const validated = ICountrySchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      const country = await Country.create(validated.data);
      if (country) {
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
    console.log(data);
    if (data) {
      await DatabaseConnection();
      await Country.deleteMany({
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
