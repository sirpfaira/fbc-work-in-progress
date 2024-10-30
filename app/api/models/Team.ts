import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
  {
    uid: Number,
    name: String,
    competition: Number,
  },
  { versionKey: false }
);

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

export default Team;
