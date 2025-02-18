import mongoose, { Schema } from "mongoose";

const dummySchema = new Schema(
  {
    realname: String,
    username: String,
    platform: String,
    url: String,
    special: String,
  },
  { versionKey: false }
);

const Dummy = mongoose.models.Dummy || mongoose.model("Dummy", dummySchema);

export default Dummy;
