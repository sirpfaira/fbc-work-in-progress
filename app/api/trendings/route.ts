import DatabaseConnection from "@/lib/dbconfig";
import { ITrendingSchema } from "@/lib/schemas/trending";
import { NextRequest, NextResponse } from "next/server";
import Trending from "@/app/api/models/Trending";
// import trending from "./trending.json";

export async function GET() {
  try {
    await DatabaseConnection();
    const trending = await Trending.find();
    if (trending) {
      return NextResponse.json({ items: trending }, { status: 200 });
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
    const validated = ITrendingSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      const trending = await Trending.create(validated.data);
      if (trending) {
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
    if (data) {
      await DatabaseConnection();
      await Trending.deleteMany({
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
