import mongoose, { Schema } from "mongoose";

const marketSchema = new Schema(
  {
    uid: Number,
    apiId: Number,
    marketName: String,
    group: [Number],
    selections: [{ _id: Number, name: String }],
  },
  { versionKey: false }
);

const Market = mongoose.models.Market || mongoose.model("Market", marketSchema);

export default Market;
