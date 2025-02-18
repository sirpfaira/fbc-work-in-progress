import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
  {
    uid: Number,
    name: String,
    country: String,
    alias: String,
  },
  { versionKey: false }
);

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

export default Team;
