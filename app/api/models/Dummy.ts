import mongoose, { Schema } from "mongoose";

const dummySchema = new Schema(
  {
    realname: String,
    username: String,
    url: String,
  },
  { versionKey: false }
);

const Dummy = mongoose.models.Dummy || mongoose.model("Dummy", dummySchema);

export default Dummy;
