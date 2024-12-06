import { ObjectId } from "mongoose";
import { z } from "zod";

export const ITrendingSchema = z.object({
  uid: z.string().trim().min(1),
  fixture: z.coerce.number().min(1),
  fixtureName: z.string().trim().min(1),
  market: z.coerce.number().min(1),
  marketName: z.string().trim().min(1),
  competition: z.coerce.number().min(1),
  competitionName: z.string().trim().min(1),
  date: z.string().trim().min(1),
  result: z.string().nullable(),
  count: z.coerce.number().min(1),
  value: z.coerce.number().min(1),
});

export type ITrending = z.infer<typeof ITrendingSchema>;

export type TTrending = z.infer<typeof ITrendingSchema> & {
  _id: ObjectId;
};
