import { ObjectId } from "mongoose";
import { z } from "zod";

export const BPunterSchema = z.object({
  name: z.string().trim().min(3).max(50),
  username: z.string().trim().min(3).max(20),
  country: z.string().trim().min(1).max(20),
  platform: z.string().trim().min(1).max(100),
});

export const IPunterSchema = BPunterSchema.extend({
  image: z.string().nullable(),
  form: z.array(z.string()),
  followers: z.array(z.string()),
  following: z.array(z.string()),
});

export type BPunter = z.infer<typeof BPunterSchema>;
export type IPunter = z.infer<typeof IPunterSchema>;

export type TPunter = z.infer<typeof IPunterSchema> & {
  _id: ObjectId;
};
