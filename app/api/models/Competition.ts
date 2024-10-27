import mongoose, { Schema } from "mongoose";

const competitionSchema = new Schema(
  {
    uid: String,
    name: String,
    season: Number,
    priority: Number,
    country: String,
  },
  { versionKey: false }
);

const Competition =
  mongoose.models.Competition ||
  mongoose.model("Competition", competitionSchema);

export default Competition;
