"use client";
import moment from "moment";
import { useEffect, useState } from "react";

interface TimestampProps {
  date: string;
}

export default function TimeStamp({ date }: Readonly<TimestampProps>) {
  const [hydrated, setHydrated] = useState<boolean>(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return <span className="text-card">...</span>;
  }

  const inputDate = moment(date);
  const currentDate = moment();
  let timestamp = "";

  if (inputDate.isSame(currentDate, "day")) {
    timestamp = `Today, ${inputDate.format("HH:mm")}`;
  } else if (inputDate.isSame(currentDate.clone().subtract(1, "days"), "day")) {
    timestamp = `Yesterday, ${inputDate.format("HH:mm")}`;
  } else if (inputDate.isSame(currentDate.clone().add(1, "days"), "day")) {
    timestamp = `Tomorrow, ${inputDate.format("HH:mm")}`;
  } else {
    timestamp = inputDate.format("ddd D MMM, HH:mm");
  }

  return <span> {timestamp}</span>;
}
