import { ObjectId } from "mongoose";
import { z } from "zod";

export const ICountrySchema = z.object({
  uid: z
    .string()
    .trim()
    .min(1, { message: "Country UID must not be empty!" })
    .max(36, { message: "Country UID must not exceed 36 characters!" }),
  name: z
    .string()
    .trim()
    .min(1, { message: "Country name must not be empty!" })
    .max(36, { message: "Country name must not exceed 36 characters!" }),
});

export type ICountry = z.infer<typeof ICountrySchema>;

export type TCountry = z.infer<typeof ICountrySchema> & { _id: ObjectId };
