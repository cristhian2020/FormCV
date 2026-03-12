import { useState, useMemo, useRef, useEffect, useCallback, type ChangeEvent } from "react";
import dayjs from "dayjs";
import type { DayData, EmployeeInfo, ProjectInfo } from "../components/forms/Sheet/types";
import { DAYS, INITIAL_WEEK_DATA, LS_KEY } from "../components/forms/Sheet/types";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return null;
}

function calculateHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;
  const start = dayjs(`2000-01-01T${startTime}`);
  let end = dayjs(`2000-01-01T${endTime}`);
  if (end.isBefore(start)) end = end.add(1, "day");
  const diff = end.diff(start, "hour", true);
  return Math.round(diff * 100) / 100;
}

export function useTimesheetForm() {
  const saved = useRef(loadFromStorage());

  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>(
    saved.current?.employeeInfo ?? { name: "", operator: "", consultantId: "", rate: "" },
  );

  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(
    saved.current?.projectInfo ?? { invoice: "", projectNumber: "", location: "" },
  );

  const [weekData, setWeekData] = useState<Record<string, DayData>>(INITIAL_WEEK_DATA);

  //  localStorage
  const saveToStorage = useCallback(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ employeeInfo, projectInfo }),
    );
  }, [employeeInfo, projectInfo]);

  useEffect(() => {
    saveToStorage();
  }, [saveToStorage]);

  // Handlers
  const handleEmployeeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeInfo((prev) => ({ ...prev, [name]: value }));
    if (name === "rate") {
      const rate = Number(value) || 0;
      setWeekData((prev) => {
        const updated = { ...prev };
        for (const day of DAYS) {
          updated[day] = {
            ...prev[day],
            billHours: rate
              ? String(Math.round(prev[day].hours * rate * 100) / 100)
              : "",
          };
        }
        return updated;
      });
    }
  };

  const handleProjectChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeekDataChange = (day: string, field: keyof DayData, value: string | number) => {
    setWeekData((prev) => {
      const updated = { ...prev[day], [field]: value };
      if (field === "startTime" || field === "endTime") {
        updated.hours = calculateHours(updated.startTime, updated.endTime);
      }
      const rate = Number(employeeInfo.rate) || 0;
      updated.billHours = rate
        ? String(Math.round(updated.hours * rate * 100) / 100)
        : "";
      return { ...prev, [day]: updated };
    });
  };

  // Computed values
  const totalHours = useMemo(
    () => Object.values(weekData).reduce((sum, d) => sum + (Number(d.hours) || 0), 0),
    [weekData],
  );

  const totalBillHours = useMemo(
    () => Object.values(weekData).reduce((sum, d) => sum + (Number(d.billHours) || 0), 0),
    [weekData],
  );

  const totalAmount = useMemo(() => {
    const rate = Number(employeeInfo.rate) || 0;
    return Math.round(totalHours * rate * 100) / 100;
  }, [totalHours, employeeInfo.rate]);

  return {
    employeeInfo,
    projectInfo,
    weekData,
    totalHours,
    totalBillHours,
    totalAmount,
    handleEmployeeChange,
    handleProjectChange,
    handleWeekDataChange,
  };
}
