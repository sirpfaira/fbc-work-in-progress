import { Types } from "mongoose";
import { z } from "zod";

export const IMarketSchema = z.object({
  _id: z.number({ required_error: "Platform market id is required!" }),
  name: z
    .string()
    .trim()
    .min(1, { message: "Platform market name must not be empty!" })
    .max(36, { message: "Platform market name must not exceed 36 chars!" }),
});

export const IPlatformSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Platform uid must not be empty!" })
    .max(36, { message: "Platform uid must not exceed 36 chars!" }),
  country: z
    .string()
    .trim()
    .min(1, { message: "Platform country must not be empty!" })
    .max(4, { message: "Platform country must not exceed 36 chars!" }),
});

export const BPlatformSchema = z.object({
  uid: z
    .string()
    .trim()
    .min(1, { message: "Platform uid must not be empty!" })
    .max(36, { message: "Platform uid must not exceed 36 chars!" }),
  markets: z.array(IMarketSchema),
});

export type IPlatformMarket = z.infer<typeof IMarketSchema>;
export type IPlatform = z.infer<typeof IPlatformSchema>;
export type BPlatform = z.infer<typeof BPlatformSchema>;
export type TPlatform = BPlatform & { _id: Types.ObjectId };
