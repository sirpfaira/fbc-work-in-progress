import mongoose, { Schema } from "mongoose";

const countrySchema = new Schema({
  uid: String,
  name: String,
});

const Country =
  mongoose.models.Country || mongoose.model("Country", countrySchema);

export default Country;
