import DatabaseConnection from "@/lib/dbconfig";
import { BFullDummySchema, IDummy } from "@/lib/schemas/dummy";
import { NextRequest, NextResponse } from "next/server";
import Dummy from "@/app/api/models/Dummy";
import Punter from "@/app/api/models/Punter";
import { IPunter } from "@/lib/schemas/punter";
import dummies from "./dummies.json";

export async function GET() {
  try {
    // await DatabaseConnection();
    // const dummies = await Dummy.find();
    if (dummies) {
      return NextResponse.json({ items: dummies }, { status: 200 });
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
    const validated = BFullDummySchema.safeParse(data);
    if (validated.success) {
      const newDummy: IDummy = {
        username: validated.data.username,
        realname: validated.data.realname,
        url: validated.data.url,
      };
      const newPunter: IPunter = {
        username: validated.data.username,
        name: validated.data.name,
        country: validated.data.country,
        platform: validated.data.platform,
        rating: 0,
        image: "",
        form: [],
        followers: [],
        following: [],
      };
      await DatabaseConnection();
      const dummy = await Dummy.create(newDummy);
      const punter = await Punter.create(newPunter);
      if (dummy && punter) {
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
      await Dummy.deleteMany({
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
