import { NextRequest, NextResponse } from "next/server";
import { ICountrySchema } from "@/lib/schemas/country";
import DatabaseConnection from "@/lib/dbconfig";
import Country from "@/app/api/models/Country";

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    await DatabaseConnection();
    const country = await Country.findOne({ _id: id });

    if (country) {
      return NextResponse.json({ item: country }, { status: 200 });
    } else {
      throw new Error("Country not found!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    const data = await request.json();
    const validated = ICountrySchema.safeParse(data);
    console.log(id);
    if (validated.success) {
      await Country.findByIdAndUpdate(id, validated.data);
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Invalid data!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: any }
// ) {
//   try {
//     const { id } = params;
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     if (id) {
//       // await dbConnect();
//       // await Country.findByIdAndDelete(id);
//       const response = await fetch(`${url}/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.ok) {
//         return NextResponse.json(
//           { message: `Country with id <${id}> was deleted!` },
//           { status: 200 }
//         );
//       } else {
//         throw new Error("Server error!");
//       }
//     } else {
//       throw new Error("Country id was not received!");
//     }
//   } catch (error: any) {
//     return NextResponse.json(error.message, { status: 500 });
//   }
// }
