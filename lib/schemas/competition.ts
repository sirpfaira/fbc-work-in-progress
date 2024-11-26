import { ObjectId } from "mongoose";
import { z } from "zod";

export const ICompetitionSchema = z.object({
  uid: z.coerce.number().min(1),
  name: z
    .string()
    .trim()
    .min(1, { message: "Competition name must not be empty!" })
    .max(36, { message: "Competition name must not exceed 36 characters!" }),
  season: z.coerce.number().min(1),
  priority: z.coerce.number().min(1),
  country: z
    .string()
    .trim()
    .min(1, { message: "Competition country must not be empty!" })
    .max(4, { message: "Competition country must not exceed 36 characters!" }),
});

export type ICompetition = z.infer<typeof ICompetitionSchema>;

export type TCompetition = z.infer<typeof ICompetitionSchema> & {
  _id: ObjectId;
};
