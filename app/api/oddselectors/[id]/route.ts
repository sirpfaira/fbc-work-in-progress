import { NextRequest, NextResponse } from "next/server";
import { IOddSelectorSchema } from "@/lib/schemas/oddselector";
import DatabaseConnection from "@/lib/dbconfig";
import OddSelector from "@/app/api/models/OddSelector";
import oddSelectors from "../oddselectors.json";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const oddSelector = oddSelectors.find((item) => item._id == id);
    // await DatabaseConnection();
    // const oddSelector = await OddSelector.findOne({ _id: id });

    if (oddSelector) {
      return NextResponse.json({ item: oddSelector }, { status: 200 });
    } else {
      throw new Error("OddSelector not found!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const data = await request.json();
    const update = {
      uid: data.uid,
      apiId: data.apiId,
      name: data.name,
      alias: data.alias,
    };
    const validated = IOddSelectorSchema.safeParse(update);
    if (validated.success) {
      await DatabaseConnection();
      await OddSelector.findByIdAndUpdate(id, validated.data);
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
      await OddSelector.findByIdAndDelete(id);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("OddSelector id was not received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
