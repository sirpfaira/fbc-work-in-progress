import { ObjectId } from "mongoose";
import { z } from "zod";

export const IScoresSchema = z.object({
  tenMinutes: z.string(),
  halfTime: z.string(),
  fullTime: z.string(),
  extraTime: z.string(),
  penalties: z.string(),
});

export const ICornersSchema = z.object({
  halfTime: z.string(),
  fullTime: z.string(),
});

export const IBookingsSchema = z.object({
  halfTime: z.string(),
  fullTime: z.string(),
});

export const IOddsSchema = z.object({
  _id: z.number({ required_error: "Fixture odd id is required!" }),
  value: z.number({ required_error: "Fixture odd value is required!" }),
});

export const BFixtureSchema = z.object({
  uid: z.coerce.number().min(1, { message: "Fixture uid is required!" }),
  date: z
    .string()
    .datetime({ message: "Invalid datetime string! Must be UTC." })
    .pipe(z.coerce.date()),
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
});

export const IFixtureSchema = z.object({
  uid: z.coerce.number().min(1, { message: "Fixture uid is required!" }),
  date: z
    .string()
    .datetime({ message: "Invalid datetime string! Must be UTC." })
    .pipe(z.coerce.date()),
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

export type IFixture = z.infer<typeof IFixtureSchema>;
export type BFixture = z.infer<typeof BFixtureSchema>;
export type TFixture = IFixture & { _id: ObjectId };
