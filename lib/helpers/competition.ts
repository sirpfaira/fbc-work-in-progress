export function getSeasonOptions() {
  const currentYear = new Date().getFullYear();
  const yearsArray = [];
  for (let i = -4; i <= 5; i++) {
    yearsArray.push(currentYear + i);
  }
  return yearsArray;
}
