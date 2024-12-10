import { ObjectId } from "mongoose";
import { z } from "zod";

export const IMarketSchema = z.object({
  _id: z.coerce.number().min(1),
  name: z
    .string()
    .trim()
    .min(1, { message: "Platform market name must not be empty!" })
    .max(36, {
      message: "Platform market name must not exceed 36 characters!",
    }),
});

export const BPlatformSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Platform uid must not be less than 3 characters!" })
    .max(36, { message: "Platform uid must not exceed 36 characters!" }),
  country: z
    .string()
    .trim()
    .min(1, { message: "Platform country is required!" }),
});

export const IPlatformSchema = z.object({
  uid: z
    .string()
    .trim()
    .min(1, { message: "Platform uid must not be empty!" })
    .max(36, { message: "Platform uid must not exceed 36 characters!" }),
  country: z
    .string()
    .trim()
    .min(1, { message: "Platform country is required!" }),
  markets: z.array(IMarketSchema),
});

export type IPlatformMarket = z.infer<typeof IMarketSchema>;
export type IPlatform = z.infer<typeof IPlatformSchema>;
export type BPlatform = z.infer<typeof BPlatformSchema>;
export type TPlatform = IPlatform & { _id: ObjectId };
