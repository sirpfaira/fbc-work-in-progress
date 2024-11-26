import { ObjectId } from "mongoose";
import { z } from "zod";

export const ITeamSchema = z.object({
  uid: z.coerce.number().min(1),
  name: z
    .string()
    .trim()
    .min(1, { message: "Team name must not be empty!" })
    .max(36, { message: "Team name must not exceed 36 characters!" }),
  competition: z.coerce.number().min(1),
  alias: z.string(),
});

export type ITeam = z.infer<typeof ITeamSchema>;

export type TTeam = z.infer<typeof ITeamSchema> & {
  _id: ObjectId;
};
