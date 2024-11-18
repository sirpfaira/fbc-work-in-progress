import mongoose, { Schema } from "mongoose";

const punterSchema = new Schema(
  {
    name: String,
    username: String,
    country: String,
    platform: String,
    rating: Number,
    image: String,
    form: [String],
    followers: [String],
    following: [String],
  },
  { versionKey: false }
);

const Punter = mongoose.models.Punter || mongoose.model("Punter", punterSchema);

export default Punter;

// Password and email will be with auth provider or in a separate collection if we are having our own auth
// Blocked contacts will go together with starred and playground
// blocked: [String],
