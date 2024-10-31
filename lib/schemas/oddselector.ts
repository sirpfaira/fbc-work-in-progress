import { ObjectId } from "mongoose";
import { z } from "zod";

export const IOddSelectorSchema = z.object({
  uid: z.number({ required_error: "OddSelector uid is required!" }),
  apiId: z.number({ required_error: "OddSelector apiId is required!" }),
  name: z
    .string()
    .trim()
    .min(1, { message: "OddSelector name must not be empty!" })
    .max(36, { message: "OddSelector name must not exceed 36 characters!" }),
  alias: z.string().optional(),
});

export type IOddSelector = z.infer<typeof IOddSelectorSchema>;

export type TOddSelector = z.infer<typeof IOddSelectorSchema> & {
  _id: ObjectId;
};
