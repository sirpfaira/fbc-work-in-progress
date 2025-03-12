import { IFixture, TFixture } from "@/lib/schemas/fixture";
import { TTrending } from "@/lib/schemas/trending";
import { updateTrending } from "@/lib/helpers/trending";
import axios from "axios";

export function isFixtureFinished(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = diffInMs / (1000 * 60);
  return diffInMins >= 120;
}

export function compareFixtureScores(
  oldFixture: TFixture,
  newFixture: IFixture
) {
  const statusChanged = oldFixture.status !== newFixture.status;
  const scoresChanged =
    oldFixture.scores.fullTime !== newFixture.scores.fullTime;
  if (statusChanged || scoresChanged) {
    return true;
  }
  return false;
}

export async function updateFixturesInDatabase(
  fixtures: TFixture[],
  fetchedFixtures: IFixture[],
  trending: TTrending[],
  mode: "scores" | "statistics" | "events"
) {
  const errors: string[] = [];
  try {
    let newFixtures: IFixture[] = [];
    if (fixtures.length > 0) {
      for (const newFixture of fetchedFixtures) {
        const oldFixture = fixtures.find((item) => item.uid === newFixture.uid);
        if (oldFixture) {
          if (mode === "scores") {
            const infoChanged = compareFixtureScores(oldFixture, newFixture);
            if (infoChanged) {
              const finalItem: TFixture = {
                ...oldFixture,
                status: newFixture.status,
                date: newFixture.date,
                scores: {
                  ...oldFixture.scores,
                  halfTime: newFixture.scores.halfTime,
                  fullTime: newFixture.scores.fullTime,
                  extraTime: newFixture.scores.extraTime,
                  penalties: newFixture.scores.penalties,
                },
              };
              const response = await axios.put(
                `/api/fixtures/${finalItem._id}`,
                finalItem
              );
              if (response.status == 200) {
                const trendErrors = await updateTrending(
                  trending,
                  finalItem,
                  mode
                );
                errors.concat(trendErrors);
              } else {
                errors.push(`Error updating fixture ${finalItem.uid}`);
              }
            }
          } else if (mode === "statistics") {
            const finalItem: TFixture = {
              ...oldFixture,
              corners: {
                halfTime: newFixture.corners.halfTime,
                fullTime: newFixture.corners.fullTime,
              },
              bookings: {
                halfTime: newFixture.bookings.halfTime,
                fullTime: newFixture.bookings.fullTime,
              },
            };
            const response = await axios.put(
              `/api/fixtures/${finalItem._id}`,
              finalItem
            );
            if (response.status == 200) {
              updateTrending(trending, finalItem, mode);
            } else {
              errors.push(`Error updating fixture ${finalItem.uid}`);
            }
          }
        } else {
          if (mode === "scores") newFixtures.push(newFixture);
        }
      }
    } else {
      newFixtures = [...fetchedFixtures];
    }

    if (newFixtures.length > 0) {
      const response = await axios.post(`/api/batch/fixtures`, newFixtures);
      if (response.status !== 200) {
        errors.unshift("Failed to add new fixtures batch!");
      }
    }
  } catch (error: any) {
    errors.unshift(error?.message);
  }
  return errors;
}
