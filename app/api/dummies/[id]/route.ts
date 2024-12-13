import { NextRequest, NextResponse } from "next/server";
import { BFullDummySchema } from "@/lib/schemas/dummy";
import DatabaseConnection from "@/lib/dbconfig";
import Dummy from "@/app/api/models/Dummy";
import Punter from "@/app/api/models/Punter";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    await DatabaseConnection();
    const punter = await Punter.findOne({ _id: id });
    if (punter) {
      const dummy = await Dummy.findOne({ username: punter.username });
      if (dummy) {
        return NextResponse.json(
          { item: { punter: punter, dummy: dummy } },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            item: {
              punter: punter,
              dummy: {
                _id: "",
                realname: "",
                username: "",
                url: "",
              },
            },
          },
          { status: 200 }
        );
      }
    } else {
      throw new Error("Punter not found!");
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
      const punter = await Punter.findOne({ _id: id });
      if (punter) {
        await Punter.findByIdAndUpdate(id, {
          $set: {
            name: validated.data.name,
            username: validated.data.username,
            country: validated.data.country,
            platform: validated.data.platform,
          },
        });
        await Dummy.findOneAndUpdate(
          { username: punter.username },
          {
            $set: {
              realname: validated.data.realname,
              username: validated.data.username,
              url: validated.data.url,
            },
          },
          { upsert: false, new: true } // new: true - returns an updated object
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
      await Dummy.findByIdAndDelete(id);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Dummy id was not received!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
