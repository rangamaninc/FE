import dayjs from "dayjs";

export function toInputDate(value) {
  if (!value) return "";
  const parsed = dayjs(value, ["MM/DD/YYYY", "YYYY-MM-DD"], true);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
}

export function fromInputDate(value) {
  if (!value) return "";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("MM/DD/YYYY") : "";
}
