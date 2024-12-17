import { ObjectId } from "mongoose";
import { z } from "zod";

export const ICountrySchema = z.object({
  uid: z.string().trim().min(1).max(20),
  name: z.string().trim().min(1).max(50),
});

export type ICountry = z.infer<typeof ICountrySchema>;

export type TCountry = z.infer<typeof ICountrySchema> & { _id: ObjectId };
