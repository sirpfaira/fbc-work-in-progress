import DatabaseConnection from "@/lib/dbconfig";
import { IPunterSchema } from "@/lib/schemas/punter";
import { NextRequest, NextResponse } from "next/server";
import Punter from "@/app/api/models/Punter";
import punters from "./data.json";

export async function GET() {
  try {
    // await DatabaseConnection();
    // const punters = await Punter.find();
    if (punters) {
      return NextResponse.json({ items: punters }, { status: 200 });
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
    const validated = IPunterSchema.safeParse(data);
    console.log(data);
    if (validated.success) {
      await DatabaseConnection();
      const punter = await Punter.create(validated.data);
      if (punter) {
        return NextResponse.json({ message: "Success!" }, { status: 200 });
      } else {
        throw new Error("Something went wrong!");
      }
    } else {
      throw new Error("Invalid data!");
    }
  } catch (error: any) {
    console.log(error?.message);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    if (data) {
      await DatabaseConnection();
      await Punter.deleteMany({
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
