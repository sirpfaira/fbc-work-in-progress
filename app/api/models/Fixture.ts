import mongoose, { Schema } from "mongoose";

const fixtureSchema = new Schema(
  {
    uid: Number,
    date: Date,
    status: String,
    competition: Number,
    competitionName: String,
    teams: String,
    homeTeam: Number,
    awayTeam: Number,
    scores: {
      tenMinutes: String,
      halfTime: String,
      fullTime: String,
      extraTime: String,
      penalties: String,
    },
    corners: {
      halfTime: String,
      fullTime: String,
    },
    bookings: {
      halfTime: String,
      fullTime: String,
    },
    odds: [{ _id: Number, value: Number }],
  },
  { versionKey: false }
);

const Fixture =
  mongoose.models.Fixture || mongoose.model("Fixture", fixtureSchema);

export default Fixture;
