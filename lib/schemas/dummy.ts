import { ObjectId } from "mongoose";
import { z } from "zod";
import { BPunterSchema, IPunterSchema } from "./punter";

export const IDummySchema = z.object({
  realname: z.string().trim().min(3).max(50),
  username: z.string().trim().min(3).max(20),
  url: z.string(),
});

export const BFullDummySchema = z.intersection(BPunterSchema, IDummySchema);
export const IFullDummySchema = z.intersection(IPunterSchema, IDummySchema);

export type IDummy = z.infer<typeof IDummySchema>;
export type BFullDummy = z.infer<typeof BFullDummySchema>;
export type IFullDummy = z.infer<typeof IFullDummySchema>;
export type TDummy = z.infer<typeof IDummySchema> & {
  _id: ObjectId;
};
export type TFullDummy = z.infer<typeof IFullDummySchema> & {
  _id: ObjectId;
};
