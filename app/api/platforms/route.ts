import DatabaseConnection from "@/lib/dbconfig";
import { BPlatformSchema } from "@/lib/schemas/platform";
import { NextRequest, NextResponse } from "next/server";
import Platform from "@/app/api/models/Platform";
import platforms from "./platforms.json";

export async function GET() {
  try {
    // await DatabaseConnection();
    // const platforms = await Platform.find();
    if (platforms) {
      return NextResponse.json({ items: platforms }, { status: 200 });
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
    const validated = BPlatformSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      const { name, country } = validated.data;
      const platform = await Platform.create({
        uid: `${country}-${name}`,
        markets: [],
      });
      if (platform) {
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
      await Platform.deleteMany({
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
