import { NextRequest, NextResponse } from "next/server";
import { BFullDummySchema } from "@/lib/schemas/dummy";
import DatabaseConnection from "@/lib/dbconfig";
import Dummy from "@/app/api/models/Dummy";
import Punter from "@/app/api/models/Punter";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    await DatabaseConnection();
    const dummy = await Dummy.findOne({ _id: id });
    if (dummy) {
      const punter = await Punter.findOne({ username: dummy.username });
      if (punter) {
        return NextResponse.json(
          { item: { punter: punter, dummy: dummy } },
          { status: 200 }
        );
      } else {
        throw new Error("Punter not found!");
      }
    } else {
      throw new Error("Dummy not found!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const data = await request.json();
    const validated = BFullDummySchema.safeParse(data);
    if (validated.success) {
      await DatabaseConnection();
      const dummy = await Dummy.findOne({ _id: id });
      if (dummy) {
        await Dummy.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              realname: validated.data.realname,
              username: validated.data.username,
              platform: validated.data.platform,
              url: validated.data.url,
              special: validated.data.special,
            },
          },
          { upsert: false, new: true } // new: true - returns an updated object
        );
        await Punter.findOneAndUpdate(
          { username: dummy.username },
          {
            $set: {
              name: validated.data.name,
              username: validated.data.username,
              country: validated.data.country,
              platform: validated.data.platform,
            },
          }
        );

        return NextResponse.json({ message: "Success!" }, { status: 200 });
      } else {
        throw new Error("Invalid data!");
      }
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
      const dummy = await Dummy.findOne({ _id: id });
      if (dummy) {
        await Dummy.findByIdAndDelete(id);
        await Punter.findOneAndDelete({ username: dummy.username });
      } else {
        throw new Error("Dummy not found!");
      }
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Dummy id was not received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
