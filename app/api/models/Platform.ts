import mongoose, { Schema } from "mongoose";

const platformSchema = new Schema(
  {
    uid: String,
    name: String,
    country: String,
    markets: [{ _id: Number, name: String }],
  },
  { versionKey: false }
);

const Platform =
  mongoose.models.Platform || mongoose.model("Platform", platformSchema);

export default Platform;
