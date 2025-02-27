import { ObjectId } from "mongoose";
import { z } from "zod";

export const BLeagueSchema = z.object({
  competition: z.number().min(1),
  date: z.date(),
});

export const ILeagueSchema = z.object({
  uid: z.number().min(1),
  season: z.number().min(1),
  date: z.string().min(1),
});

export const IScoresSchema = z.object({
  tenMinutes: z.string().nullable(),
  halfTime: z.string().nullable(),
  fullTime: z.string().nullable(),
  extraTime: z.string().nullable(),
  penalties: z.string().nullable(),
});

export const ICornersSchema = z.object({
  halfTime: z.string().nullable(),
  fullTime: z.string().nullable(),
});

export const IBookingsSchema = z.object({
  halfTime: z.string().nullable(),
  fullTime: z.string().nullable(),
});

export const IOddsSchema = z.object({
  _id: z.coerce.number().min(1),
  value: z.coerce.number().min(1.01),
});

export const BFixtureSchema = z
  .object({
    uid: z.coerce.number().min(1),
    date: z.date(),
    status: z.string().trim().min(5).max(36),
    competition: z.number().min(1),
    homeTeam: z.number().min(1),
    awayTeam: z.number().min(1),
  })
  .refine((data) => data.homeTeam !== data.awayTeam, {
    path: ["awayTeam"],
    message: "Away team can not be the same as home team!",
  });

export const IFixtureSchema = z.object({
  uid: z.coerce.number().min(1),
  date: z.string(),
  status: z.string().trim().min(5).max(36),
  competition: z.number().min(1),
  competitionName: z.string().trim().min(3).max(50),
  teams: z.string().trim().min(5).max(100),
  homeTeam: z.number().min(1),
  awayTeam: z.number().min(1),
  scores: IScoresSchema,
  corners: ICornersSchema,
  bookings: IBookingsSchema,
  odds: z.array(IOddsSchema),
});

export const ICornersBookingsSchema = z.object({
  corners: ICornersSchema,
  bookings: IBookingsSchema,
});

export const IFixtureInfoSchema = IFixtureSchema.omit({
  scores: true,
  corners: true,
  bookings: true,
  odds: true,
});

export type BLeague = z.infer<typeof BLeagueSchema>;
export type ILeague = z.infer<typeof ILeagueSchema>;
export type IFixtureInfo = z.infer<typeof IFixtureInfoSchema>;
export type ICornersBookings = z.infer<typeof ICornersBookingsSchema>;
export type IFixtureScores = z.infer<typeof IScoresSchema>;
export type IFixtureOdd = z.infer<typeof IOddsSchema>;
export type BFixture = z.infer<typeof BFixtureSchema>;
export type IFixture = z.infer<typeof IFixtureSchema>;
export type TFixture = IFixture & { _id: ObjectId };
