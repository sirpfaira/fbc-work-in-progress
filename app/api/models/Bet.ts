import mongoose, { Schema } from "mongoose";

const codeSchema = new Schema(
  {
    username: String,
    platform: String,
    country: String,
    value: String,
    flagged: [String],
  },
  { versionKey: false }
);

const betSchema = new Schema(
  {
    uid: String,
    user: {
      type: String,
      ref: "Punter",
    },
    title: String,
    date: String,
    boom: [String],
    doom: [String],
    selections: [String],
    codes: [codeSchema],
  },
  { versionKey: false, strictPopulate: false }
);

const Bet = mongoose.models.Bet || mongoose.model("Bet", betSchema);

export default Bet;
