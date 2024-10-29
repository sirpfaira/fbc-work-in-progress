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

const arr = [
  {
    id: 1,
    name: "One",
    sub: [
      { id: 201, name: "Two" },
      { id: 202, name: "Two" },
      { id: 201, name: "Two" },
    ],
  },
  {
    id: 2,
    name: "Two",
    sub: [
      { id: 202, name: "Two" },
      { id: 204, name: "Two" },
      { id: 204, name: "Two" },
    ],
  },
  {
    id: 1,
    name: "Three",
    sub: [
      { id: 203, name: "Two" },
      { id: 203, name: "Two" },
      { id: 207, name: "Two" },
    ],
  },
];
