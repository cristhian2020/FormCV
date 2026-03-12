export interface DayData {
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  billHours: string;
  remarks: string;
}

export interface EmployeeInfo {
  name: string;
  operator: string;
  consultantId: string;
  rate: string;
}

export interface ProjectInfo {
  invoice: string;
  projectNumber: string;
  location: string;
}

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const INITIAL_WEEK_DATA: Record<string, DayData> = {
  Sunday: { date: "", startTime: "", endTime: "", hours: 0, billHours: "", remarks: "" },
  Monday: { date: "", startTime: "", endTime: "", hours: 0, billHours: "", remarks: "" },
  Tuesday: { date: "", startTime: "", endTime: "", hours: 0, billHours: "", remarks: "" },
  Wednesday: { date: "", startTime: "", endTime: "", hours: 0, billHours: "", remarks: "" },
  Thursday: { date: "", startTime: "", endTime: "", hours: 0, billHours: "", remarks: "" },
  Friday: { date: "", startTime: "", endTime: "", hours: 0, billHours: "", remarks: "" },
  Saturday: { date: "", startTime: "", endTime: "", hours: 0, billHours: "", remarks: "" },
};

export const LS_KEY = "formsheet_data";
