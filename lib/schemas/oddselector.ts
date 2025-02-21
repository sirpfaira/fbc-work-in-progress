import { ObjectId } from "mongoose";
import { z } from "zod";

export const IOddSelectorSchema = z.object({
  uid: z.number().min(100),
  apiId: z.number().min(1),
  name: z.string().trim().min(1).max(100),
  alias: z.string().optional(),
});

export type IOddSelector = z.infer<typeof IOddSelectorSchema>;

export type TOddSelector = z.infer<typeof IOddSelectorSchema> & {
  _id: ObjectId;
};
