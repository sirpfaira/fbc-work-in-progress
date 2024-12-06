import mongoose, { Schema } from "mongoose";

const trendingSchema = new Schema(
  {
    uid: String,
    date: String,
    competition: Number,
    competitionName: String,
    fixture: Number,
    fixtureName: String,
    market: Number,
    marketName: String,
    result: String,
    count: Number,
    value: Number,
  },
  { versionKey: false }
);

const Trending =
  mongoose.models.Trending || mongoose.model("Trending", trendingSchema);

export default Trending;
