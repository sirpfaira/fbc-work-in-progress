import { ObjectId } from "mongoose";
import { z } from "zod";

export const IMarketSchema = z.object({
  _id: z.coerce.number().min(1),
  name: z.string().trim().min(1).max(60),
});

export const BPlatformSchema = z.object({
  name: z.string().trim().min(3).max(50),
  country: z.string().trim().min(1),
  url: z.string(),
});

export const IPlatformSchema = z.object({
  uid: z.string().trim().min(1).max(100),
  country: z.string().trim().min(1),
  url: z.string(),
  markets: z.array(IMarketSchema),
});

export type IPlatformMarket = z.infer<typeof IMarketSchema>;
export type IPlatform = z.infer<typeof IPlatformSchema>;
export type BPlatform = z.infer<typeof BPlatformSchema>;
export type TPlatform = IPlatform & { _id: ObjectId };
