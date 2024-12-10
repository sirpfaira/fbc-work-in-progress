import { TFixture } from "./schemas/fixture";

export interface SubItem {
  id: number;
  name: string;
}

export function getSeasonsOptions() {
  const currentYear = new Date().getFullYear();
  const yearsArray = [];
  for (let i = -4; i <= 5; i++) {
    yearsArray.push(currentYear + i);
  }
  return yearsArray;
}

export function getTrendingResult(fixture: TFixture, market: number) {
  if (fixture && market) {
    return "won";
  }
  return null;
}

export function getShortDate(isoDateString: string): string {
  const date = new Date(isoDateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
