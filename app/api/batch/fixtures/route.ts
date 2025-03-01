import DatabaseConnection from "@/lib/dbconfig";
import { IFixture, IFixtureSchema } from "@/lib/schemas/fixture";
import { NextRequest, NextResponse } from "next/server";
import Fixture from "@/app/api/models/Fixture";

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as IFixture[];
    const validFixtures = validateArray(data);
    if (validFixtures.length > 0) {
      await DatabaseConnection();
      const docs = await Fixture.insertMany(validFixtures);
      if (docs) {
        return NextResponse.json({ message: "Success!" }, { status: 200 });
      } else {
        throw new Error("Something went wrong!");
      }
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

function validateArray(fixtures: IFixture[]) {
  const valid: IFixture[] = [];
  for (const item of fixtures) {
    const validated = IFixtureSchema.safeParse(item);
    if (validated.success) {
      valid.push(validated.data);
    }
  }
  return valid;
}
