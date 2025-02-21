import DatabaseConnection from "@/lib/dbconfig";
import { IOddSelectorSchema } from "@/lib/schemas/oddselector";
import { NextRequest, NextResponse } from "next/server";
import OddSelector from "@/app/api/models/OddSelector";
import oddSelectors from "./oddselectors.json";

export async function GET() {
  try {
    // await DatabaseConnection();
    // const oddSelectors = await OddSelector.find();
    if (oddSelectors) {
      return NextResponse.json({ items: oddSelectors }, { status: 200 });
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
    const validated = IOddSelectorSchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      const oddSelector = await OddSelector.create(validated.data);
      if (oddSelector) {
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
      await OddSelector.deleteMany({
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
