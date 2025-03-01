import { IFixture, TFixture } from "@/lib/schemas/fixture";
import { TTrending } from "@/lib/schemas/trending";
import { updateTrending } from "@/lib/helpers/trending";
import axios from "axios";

export function compareFixtures(oldFixture: TFixture, newFixture: IFixture) {
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
  trending: TTrending[]
) {
  const errors: string[] = [];
  try {
    if (fixtures && fetchedFixtures) {
      if (fetchedFixtures.length > 0) {
        const newFixtures: IFixture[] = [];
        for (const newFixture of fetchedFixtures) {
          const oldFixture = fixtures.find(
            (item) => item.uid === newFixture.uid
          );
          if (oldFixture) {
            const infoChanged = compareFixtures(oldFixture, newFixture);
            if (infoChanged) {
              oldFixture.status = newFixture.status;
              oldFixture.scores.halfTime = newFixture.scores.halfTime;
              oldFixture.scores.fullTime = newFixture.scores.fullTime;
              oldFixture.scores.extraTime = newFixture.scores.extraTime;
              oldFixture.scores.penalties = newFixture.scores.penalties;
              console.log("old", oldFixture);
              const response = await axios.put(
                `/api/fixtures/${oldFixture._id}`,
                oldFixture
              );
              console.log("response", response);
              if (response.status == 200) {
                updateTrending(trending, oldFixture);
              } else {
                errors.push(`Error updating fixture ${oldFixture.uid}`);
              }
            }
          } else {
            newFixtures.push(newFixture);
          }
        }
        if (newFixtures.length > 0) {
          const response = await axios.post(`/api/batch/fixtures`, newFixtures);
          if (response.status !== 200) {
            errors.unshift("Failed to add new fixtures batch!");
          }
        }
      } else {
        throw new Error("No fixtures received from API!");
      }
    }
  } catch (error: any) {
    errors.unshift(error?.message);
  }
  return errors;
}
