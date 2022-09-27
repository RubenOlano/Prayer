import { randomUUID } from "crypto";

export const generateSessionToken = () => {
  return randomUUID();
};

export const fromDate = (time: number, date: Date = new Date()) => {
  return new Date(date.getTime() + time * 1000);
};
