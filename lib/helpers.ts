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
