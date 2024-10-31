import mongoose, { Schema } from "mongoose";

const oddSelectorSchema = new Schema({
  uid: Number,
  apiId: Number,
  name: String,
  alias: String,
});

const OddSelector =
  mongoose.models.OddSelector ||
  mongoose.model("OddSelector", oddSelectorSchema);

export default OddSelector;
