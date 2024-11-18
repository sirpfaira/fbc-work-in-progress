import { ObjectId } from "mongoose";
import { z } from "zod";

export const BPunterSchema = z.object({
  name: z.string().trim().min(3).max(36),
  username: z.string().trim().min(3).max(15),
  country: z.string().trim().min(1).max(5),
  platform: z.string().trim().min(1).max(36),
});

export const IPunterSchema = BPunterSchema.extend({
  rating: z.number().min(0).max(100),
  image: z.string().trim(),
  form: z.array(z.string()),
  followers: z.array(z.string()),
  following: z.array(z.string()),
});

export type BPunter = z.infer<typeof BPunterSchema>;
export type IPunter = z.infer<typeof IPunterSchema>;

export type TPunter = z.infer<typeof IPunterSchema> & {
  _id: ObjectId;
};
