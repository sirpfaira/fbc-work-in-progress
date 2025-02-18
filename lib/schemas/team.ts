import { ObjectId } from "mongoose";
import { z } from "zod";

export const ITeamSchema = z.object({
  uid: z.coerce.number().min(1),
  name: z.string().trim().min(1).max(60),
  country: z.string(),
  alias: z.string(),
});

export type ITeam = z.infer<typeof ITeamSchema>;

export type TTeam = z.infer<typeof ITeamSchema> & {
  _id: ObjectId;
};
