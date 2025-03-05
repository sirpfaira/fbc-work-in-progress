import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    uid: String,
    title: String,
    videos: [
      {
        type: String,
        ref: "Video",
      },
    ],
  },
  { versionKey: false }
);

const videoSchema = new mongoose.Schema(
  {
    uid: String,
    title: String,
  },
  { versionKey: false }
);

const Playlist =
  mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

export { Playlist, Video };
