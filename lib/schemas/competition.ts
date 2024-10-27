import { ObjectId } from "mongoose";
import { z } from "zod";

export const ICompetitionSchema = z.object({
  uid: z
    .string()
    .trim()
    .min(1, { message: "Competition UID must not be empty!" })
    .max(36, { message: "Competition UID must not exceed 36 chars!" }),
  name: z
    .string()
    .trim()
    .min(1, { message: "Competition name must not be empty!" })
    .max(36, { message: "Competition name must not exceed 36 chars!" }),
  season: z.number({ required_error: "Competition season is required!" }),
  priority: z.number({ required_error: "Competition priority is required!" }),
  country: z
    .string()
    .trim()
    .min(1, { message: "Competition country must not be empty!" })
    .max(4, { message: "Competition country must not exceed 36 chars!" }),
});

export type ICompetition = z.infer<typeof ICompetitionSchema>;

export type TCompetition = z.infer<typeof ICompetitionSchema> & {
  _id: ObjectId;
};
