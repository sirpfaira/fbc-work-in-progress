import mongoose, { Schema } from "mongoose";

const codeSchema = new Schema(
  {
    username: String,
    platform: String,
    value: String,
    flagged: [String],
  },
  { versionKey: false }
);

const betSchema = new Schema(
  {
    uid: String,
    username: String,
    title: String,
    boom: [String],
    doom: [String],
    selections: [String],
    codes: [codeSchema],
  },
  { versionKey: false }
);

const Bet = mongoose.models.Bet || mongoose.model("Bet", betSchema);

export default Bet;
