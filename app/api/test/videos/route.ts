import DatabaseConnection from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { Playlist, Video } from "../../models/test";

export async function GET() {
  try {
    await DatabaseConnection();
    const videos = await Video.find();
    if (videos) {
      return NextResponse.json({ items: videos }, { status: 200 });
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
    await DatabaseConnection();
    const video = await Video.create(data);
    if (video) {
      await Playlist.updateOne(
        { uid: "playlist1" },
        { $addToSet: { videos: video.uid } }
      );
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Something went wrong!");
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
