import { ObjectId } from "mongoose";
import { z } from "zod";

export const IScoreSchema = z.object({
  tenMinutes: z.string().optional(),
  halfTime: z.string().optional(),
  fullTime: z.string().optional(),
  extraTime: z.string().optional(),
  penalties: z.string().optional(),
});

export const ICornersSchema = z.object({
  halfTime: z.string().optional(),
  fullTime: z.string().optional(),
});

export const IBookingsSchema = z.object({
  halfTime: z.string().optional(),
  fullTime: z.string().optional(),
});

export const IOddsSchema = z.object({
  _id: z.number({ required_error: "Fixture odd id is required!" }),
  value: z.number({ required_error: "Fixture odd value is required!" }),
});

export const BFixtureSchema = z.object({
  uid: z.number({ required_error: "Fixture uid is required!" }),
  date: z
    .string()
    .trim()
    .min(12, { message: "Fixture date must not be less than 12 characters!" })
    .max(36, { message: "Fixture uid must not exceed 36 characters!" }),
  status: z
    .string()
    .trim()
    .min(5, { message: "Fixture date must not be less than 5 characters!" })
    .max(36, { message: "Fixture uid must not exceed 36 characters!" }),
  competition: z.number({ required_error: "Fixture competition is required!" }),
  homeTeam: z.number({ required_error: "Fixture competition is required!" }),
  awayTeam: z.number({ required_error: "Fixture competition is required!" }),
});

export const IFixtureSchema = z.object({
  uid: z.number({ required_error: "Fixture uid is required!" }),
  date: z
    .string()
    .trim()
    .min(12, { message: "Fixture date must not be less than 12 characters!" })
    .max(36, { message: "Fixture uid must not exceed 36 characters!" }),
  status: z
    .string()
    .trim()
    .min(5, { message: "Fixture date must not be less than 5 characters!" })
    .max(36, { message: "Fixture uid must not exceed 36 characters!" }),
  competition: z.number({ required_error: "Fixture competition is required!" }),
  competitionName: z
    .string()
    .trim()
    .min(5, { message: "Fixture date must not be less than 5 characters!" })
    .max(36, { message: "Fixture uid must not exceed 36 characters!" }),
  teams: z
    .string()
    .trim()
    .min(5, { message: "Fixture date must not be less than 5 characters!" })
    .max(36, { message: "Fixture uid must not exceed 36 characters!" }),
  homeTeam: z.number({ required_error: "Fixture competition is required!" }),
  awayTeam: z.number({ required_error: "Fixture competition is required!" }),
  score: IScoreSchema,
  corners: ICornersSchema,
  bookings: IBookingsSchema,
  odds: z.array(IOddsSchema),
});

export type IFixture = z.infer<typeof IFixtureSchema>;
export type BFixture = z.infer<typeof BFixtureSchema>;
export type TFixture = IFixture & { _id: ObjectId };
