import moment from "moment";

export function shortenNumber(number: number): string {
  if (number > 999999) return `${Number(number / 1000000).toFixed(1)}M`;
  if (number > 9999) return `${Number(number / 1000).toFixed(0)}K`;
  if (number > 999) return `${Number(number / 1000).toFixed(1)}K`;
  return `${number}`;
}

export function formatDate(dateString: string) {
  const inputDate = moment(dateString);
  const currentDate = moment();

  if (inputDate.isSame(currentDate, "day")) {
    return `Today, ${inputDate.format("HH:mm")}`;
  } else if (inputDate.isSame(currentDate.clone().subtract(1, "days"), "day")) {
    return `Yesterday, ${inputDate.format("HH:mm")}`;
  } else if (inputDate.isSame(currentDate.clone().add(1, "days"), "day")) {
    return `Tomorrow, ${inputDate.format("HH:mm")}`;
  } else {
    return inputDate.format("ddd D MMM, HH:mm");
  }
}

export function formatNumber(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
