import { TTrending } from "@/lib/schemas/trending";

export function getPunterRating(form: string[], trending: TTrending[]): number {
  if (form.length < 13) {
    return 0;
  } else {
    return form.length + trending.length;
  }
}

export function getRandomPictureURL() {
  const genders = ["men", "women"];
  const randomGender = genders[Math.floor(Math.random() * genders.length)];
  const randomPosition = Math.floor(Math.random() * 100); // 0 to 99 inclusive
  return `https://randomuser.me/api/portraits/${randomGender}/${randomPosition}.jpg`;
}
