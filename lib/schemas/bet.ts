import { ObjectId } from "mongoose";
import { z } from "zod";

export const BSelectionSchema = z.object({
  fixture: z.coerce.number().min(1),
  market: z.coerce.number().min(1),
});

export const BCodeSchema = z.object({
  platform: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

export const ICodeSchema = z.object({
  username: z.string().trim().min(1),
  platform: z.string().trim().min(1),
  value: z.string().trim().min(1),
  flagged: z.array(z.string()),
});

export const BBetInfoSchema = z.object({
  username: z.string().trim().min(1),
  title: z.string().trim().min(1),
});

export const BBetSchema = z.object({
  username: z.string().trim().min(1),
  title: z.string().trim().min(1),
  selections: z.array(z.string()),
  codes: z.array(ICodeSchema),
});

export const CBetSchema = z.object({
  username: z.string().trim().min(1),
  title: z.string().trim().min(1),
  selections: z.array(z.string()),
  codes: z.array(ICodeSchema),
});

export const IBetSchema = z.object({
  uid: z.string().trim().min(1),
  username: z.string().trim().min(1),
  title: z.string().trim().min(1),
  boom: z.array(z.string()),
  doom: z.array(z.string()),
  selections: z.array(z.string()),
  codes: z.array(ICodeSchema),
});

export type ISelection = {
  fixture: number;
  fixtureName: string;
  market: number;
  marketName: string;
  competition: number;
  competitionName: string;
  date: string;
};

export interface CBet {
  username: string;
  title: string;
  selections: ISelection[];
  codes: ICode[];
}

export type BCode = z.infer<typeof BCodeSchema>;
export type ICode = z.infer<typeof ICodeSchema>;
export type BSelection = z.infer<typeof BSelectionSchema>;
export type BBetInfo = z.infer<typeof BBetInfoSchema>;
export type BBet = z.infer<typeof BBetSchema>;
export type IBet = z.infer<typeof IBetSchema>;
export type TBet = z.infer<typeof IBetSchema> & {
  _id: ObjectId;
};
