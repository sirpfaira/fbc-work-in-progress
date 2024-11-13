import { ObjectId } from "mongoose";
import { z } from "zod";

export const IScoresSchema = z.object({
  tenMinutes: z.string().max(5),
  halfTime: z.string().max(5),
  fullTime: z.string().max(5),
  extraTime: z.string().max(5),
  penalties: z.string().max(5),
});

export const ICornersSchema = z.object({
  halfTime: z.string().max(5),
  fullTime: z.string().max(5),
});

export const IBookingsSchema = z.object({
  halfTime: z.string().max(5),
  fullTime: z.string().max(5),
});

export const IOddsSchema = z.object({
  _id: z.number({ required_error: "Fixture odd id is required!" }).min(100),
  value: z
    .number({ required_error: "Fixture odd value is required!" })
    .min(1.01),
});

export const BFixtureSchema = z
  .object({
    uid: z.coerce.number().min(1, { message: "Fixture uid is required!" }),
    date: z.date(),
    status: z
      .string()
      .trim()
      .min(5, { message: "Fixture date must not be less than 5 characters!" })
      .max(36, { message: "Fixture uid must not exceed 36 characters!" }),
    competition: z
      .number()
      .min(1, { message: "Fixture competition is required!" }),
    homeTeam: z.number().min(1, { message: "Fixture home team is required!" }),
    awayTeam: z.number().min(1, { message: "Fixture away team is required!" }),
  })
  .refine((data) => data.homeTeam !== data.awayTeam, {
    path: ["awayTeam"],
    message: "Away team can not be the same as home team!",
  });

export const IFixtureSchema = z.object({
  uid: z.coerce.number().min(1, { message: "Fixture uid is required!" }),
  date: z.string(),
  status: z
    .string()
    .trim()
    .min(5, { message: "Fixture date must not be less than 5 characters!" })
    .max(36, { message: "Fixture uid must not exceed 36 characters!" }),
  competition: z
    .number()
    .min(1, { message: "Fixture competition is required!" }),
  competitionName: z
    .string()
    .trim()
    .min(3, { message: "Fixture date must not be less than 3 characters!" })
    .max(36, { message: "Fixture uid must not exceed 36 characters!" }),
  teams: z
    .string()
    .trim()
    .min(5, { message: "Fixture date must not be less than 5 characters!" })
    .max(36, { message: "Fixture uid must not exceed 36 characters!" }),
  homeTeam: z.number().min(1, { message: "Fixture home team is required!" }),
  awayTeam: z.number().min(1, { message: "Fixture away team is required!" }),
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

export type IFixtureInfo = z.infer<typeof IFixtureInfoSchema>;
export type ICornersBookings = z.infer<typeof ICornersBookingsSchema>;
export type IFixtureScores = z.infer<typeof IScoresSchema>;
export type IFixtureOdd = z.infer<typeof IOddsSchema>;
export type BFixture = z.infer<typeof BFixtureSchema>;
export type IFixture = z.infer<typeof IFixtureSchema>;
export type TFixture = IFixture & { _id: ObjectId };
