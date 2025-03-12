import { TTrending } from "@/lib/schemas/trending";
import { RATING } from "@/lib/constants";

export function getPunterRating(form: string[], trending: TTrending[]): number {
  if (form.length < RATING) {
    return -1;
  } else {
    const formTrending: TTrending[] = [];
    form.map((item) => {
      const trend = trending.find((el) => el.uid === item);
      if (trend) formTrending.push(trend);
    });

    if (formTrending.length < RATING) {
      return -1;
    } else {
      const resulted = formTrending.filter((item) => item.result !== null);
      if (resulted.length < RATING) {
        return -1;
      } else {
        const won = formTrending.filter((item) => item.result === "won");
        const boom = won.reduce((acc, trend) => acc + trend.value, 0);
        const total = resulted.reduce((acc, trend) => acc + trend.value, 0);
        return parseFloat(((boom / total) * 100).toFixed(0));
      }
    }
    // return form.length + trending.length;
  }
}

export function getRandomPictureURL() {
  const genders = ["men", "women"];
  const randomGender = genders[Math.floor(Math.random() * genders.length)];
  const randomPosition = Math.floor(Math.random() * 100); // 0 to 99 inclusive
  return `https://randomuser.me/api/portraits/${randomGender}/${randomPosition}.jpg`;
}
