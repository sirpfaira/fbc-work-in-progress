import { ObjectId } from "mongoose";
import { z } from "zod";

export const ICompetitionSchema = z.object({
  uid: z.coerce.number().min(1),
  name: z.string().trim().min(1).max(60),
  season: z.coerce.number().min(1),
  priority: z.coerce.number().min(1),
  country: z.string().trim().min(1).max(20),
});

export type ICompetition = z.infer<typeof ICompetitionSchema>;

export type TCompetition = z.infer<typeof ICompetitionSchema> & {
  _id: ObjectId;
};
