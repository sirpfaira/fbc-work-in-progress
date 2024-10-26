import mongoose, { Schema } from "mongoose";

const countrySchema = new Schema(
  {
    uid: String,
    name: String,
  },
  { versionKey: false }
);

const Country =
  mongoose.models.Country || mongoose.model("Country", countrySchema);

export default Country;
