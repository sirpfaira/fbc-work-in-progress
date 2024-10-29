import { ObjectId } from "mongoose";
import { z } from "zod";

export const marketSchema = z.object({
  _id: z.number({ required_error: "Platform market id is required!" }),
  name: z
    .string()
    .trim()
    .min(1, { message: "Platform market name must not be empty!" })
    .max(36, { message: "Platform market name must not exceed 36 chars!" }),
});

export const IPlatformSchema = z.object({
  uid: z
    .string()
    .trim()
    .min(1, { message: "Platform uid must not be empty!" })
    .max(36, { message: "Platform uid must not exceed 36 chars!" }),
  name: z
    .string()
    .trim()
    .min(1, { message: "Platform name must not be empty!" })
    .max(36, { message: "Platform name must not exceed 36 chars!" }),
  country: z
    .string()
    .trim()
    .min(1, { message: "Platform country must not be empty!" })
    .max(4, { message: "Platform country must not exceed 36 chars!" }),
  markets: z.array(marketSchema),
});

export type IPlatformMarket = z.infer<typeof marketSchema>;
export type IPlatform = z.infer<typeof IPlatformSchema>;

export type TPlatform = z.infer<typeof IPlatformSchema> & {
  _id: ObjectId;
};
