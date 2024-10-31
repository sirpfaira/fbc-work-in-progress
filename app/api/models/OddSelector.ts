import mongoose, { Schema } from "mongoose";

const oddSelectorSchema = new Schema(
  {
    uid: Number,
    apiId: Number,
    name: String,
    alias: String,
  },
  { versionKey: false }
);

const OddSelector =
  mongoose.models.OddSelector ||
  mongoose.model("OddSelector", oddSelectorSchema);

export default OddSelector;
