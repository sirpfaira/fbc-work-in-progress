import { ObjectId } from "mongoose";
import { z } from "zod";
import { ITrending } from "./trending";

export const BSelectionSchema = z.object({
  fixture: z.coerce.number().min(1),
  market: z.coerce.number().min(1),
});

export const ISelectionSchema = z.object({
  uid: z.string().trim().min(1),
  fixture: z.coerce.number().min(1),
  fixtureName: z.string().trim().min(1),
  market: z.coerce.number().min(1),
  marketName: z.string().trim().min(1),
  competition: z.coerce.number().min(1),
  competitionName: z.string().trim().min(1),
  date: z.string().trim().min(1),
  value: z.coerce.number().min(1),
});

export const BCodeSchema = z.object({
  platform: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

export const ICodeSchema = z.object({
  username: z.string().trim().min(1),
  platform: z.string().trim().min(1),
  country: z.string().trim().min(1),
  value: z.string().trim().min(1),
  flagged: z.array(z.string()),
});

export const BBetInfoSchema = z.object({
  user: z.string().trim().min(1),
  title: z.string().trim().min(1),
});

export const CBetSchema = z.object({
  user: z.string().trim().min(1),
  title: z.string().trim().min(1),
  selections: z.array(ISelectionSchema),
  codes: z.array(ICodeSchema),
});

export const IBetSchema = z.object({
  uid: z.string().trim().min(1),
  user: z.string().trim().min(1),
  date: z.string(),
  title: z.string().trim().min(1),
  boom: z.array(z.string()),
  doom: z.array(z.string()),
  selections: z.array(z.string()),
  codes: z.array(ICodeSchema),
});

export type BCode = z.infer<typeof BCodeSchema>;
export type ICode = z.infer<typeof ICodeSchema>;
export type BSelection = z.infer<typeof BSelectionSchema>;
export type ISelection = z.infer<typeof ISelectionSchema>;
export type BBetInfo = z.infer<typeof BBetInfoSchema>;
export type CBet = z.infer<typeof CBetSchema>;
export type IBet = z.infer<typeof IBetSchema>;

export interface BUser {
  _id: ObjectId;
  username: string;
  name: string;
  image: string;
  form: string[];
}

interface Code {
  username: string;
  value: string;
  platform: string;
  country: string;
  flagged: string[];
}

export interface XBet {
  _id: ObjectId;
  uid: string;
  user: BUser;
  title: string;
  date: string;
  boom: string[];
  doom: string[];
  selections: ITrending[];
  codes: Code[];
}

export const XSelectionSchema = z.object({
  fixture: z.string().trim().min(1),
  market: z.string().trim().min(1),
});
export type XSelection = z.infer<typeof XSelectionSchema>;

export interface TBet {
  _id: ObjectId;
  uid: string;
  user: BUser;
  title: string;
  date: string;
  boom: string[];
  doom: string[];
  selections: string[];
  codes: Code[];
}
