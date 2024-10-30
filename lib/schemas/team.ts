import { ObjectId } from "mongoose";
import { z } from "zod";

export const ITeamSchema = z.object({
  uid: z.number({ required_error: "Team season is required!" }),
  name: z
    .string()
    .trim()
    .min(1, { message: "Team name must not be empty!" })
    .max(36, { message: "Team name must not exceed 36 characters!" }),
  competition: z.number({ required_error: "Team season is required!" }),
});

export type ITeam = z.infer<typeof ITeamSchema>;

export type TTeam = z.infer<typeof ITeamSchema> & {
  _id: ObjectId;
};
