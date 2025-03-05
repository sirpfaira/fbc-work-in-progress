import DatabaseConnection from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { Playlist } from "../../models/test";

export async function GET() {
  try {
    await DatabaseConnection();
    const playlists = await Playlist.find().populate({
      path: "videos",
      model: "Video",
      select: "title",
      foreignField: "uid",
    });
    if (playlists) {
      return NextResponse.json({ items: playlists }, { status: 200 });
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
    const playlist = await Playlist.create(data);
    if (playlist) {
      return NextResponse.json({ message: "Success!" }, { status: 200 });
    } else {
      throw new Error("Something went wrong!");
    }
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
