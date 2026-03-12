import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import dayjs from "dayjs";

interface DayData {
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  billHours: string;
  remarks: string;
}

interface EmployeeInfo {
  name: string;
  operator: string;
  consultantId: string;
  rate: string;
}

interface ProjectInfo {
  invoice: string;
  projectNumber: string;
  location: string;
}

const Days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const INITIAL_WEEK_DATA: Record<string, DayData> = {
  Sunday: {
    date: "",
    startTime: "",
    endTime: "",
    hours: 0,
    billHours: "",
    remarks: "",
  },
  Monday: {
    date: "",
    startTime: "",
    endTime: "",
    hours: 0,
    billHours: "",
    remarks: "",
  },
  Tuesday: {
    date: "",
    startTime: "",
    endTime: "",
    hours: 0,
    billHours: "",
    remarks: "",
  },
  Wednesday: {
    date: "",
    startTime: "",
    endTime: "",
    hours: 0,
    billHours: "",
    remarks: "",
  },
  Thursday: {
    date: "",
    startTime: "",
    endTime: "",
    hours: 0,
    billHours: "",
    remarks: "",
  },
  Friday: {
    date: "",
    startTime: "",
    endTime: "",
    hours: 0,
    billHours: "",
    remarks: "",
  },
  Saturday: {
    date: "",
    startTime: "",
    endTime: "",
    hours: 0,
    billHours: "",
    remarks: "",
  },
};

const LS_KEY = "formsheet_data";

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return null;
};

const FormSheet = () => {
  const saved = useRef(loadFromStorage());

  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>(
    saved.current?.employeeInfo ?? {
      name: "",
      operator: "",
      consultantId: "",
      rate: "",
    },
  );
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(
    saved.current?.projectInfo ?? {
      invoice: "",
      projectNumber: "",
      location: "",
    },
  );
  const [weekData, setWeekData] = useState<Record<string, DayData>>(() => {
    const stored = saved.current?.weekData;
    if (!stored) return INITIAL_WEEK_DATA;
    const result: Record<string, DayData> = {};
    for (const day of Days) {
      result[day] = {
       ...INITIAL_WEEK_DATA[day],
        remarks: stored[day]?.remarks ?? "",
      };
    }
    return result;
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  const saveToStorage = useCallback(() => {
        const manualWeekData: Record<string, { remarks: string }> = {};

    for (const day of Days) {
      manualWeekData[day] = {
        remarks: weekData[day].remarks,
      };
    }
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ employeeInfo, projectInfo, weekData: manualWeekData }),
    );
  }, [employeeInfo, projectInfo, weekData]);

  useEffect(() => {
    saveToStorage();
  }, [saveToStorage]);

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeInfo((prev) => ({ ...prev, [name]: value }));
    if (name === "rate") {
      const rate = Number(value) || 0;
      setWeekData((prev) => {
        const updated = { ...prev };
        for (const day of Days) {
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

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectInfo((prev) => ({ ...prev, [name]: value }));
  };

  const calculateHours = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const start = dayjs(`2000-01-01T${startTime}`);
    let end = dayjs(`2000-01-01T${endTime}`);
    if (end.isBefore(start)) {
      end = end.add(1, "day");
    }
    const diff = end.diff(start, "hour", true);
    return Math.round(diff * 100) / 100;
  };

  const handleWeekDataChange = (
    day: string,
    field: keyof DayData,
    value: string | number,
  ) => {
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

  const totalHours = useMemo(() => {
    return Object.values(weekData).reduce(
      (sum, day) => sum + (Number(day.hours) || 0),
      0,
    );
  }, [weekData]);

  const totalBillHours = useMemo(() => {
    return Object.values(weekData).reduce(
      (sum, day) => sum + (Number(day.billHours) || 0),
      0,
    );
  }, [weekData]);

  const totalAmount = useMemo(() => {
    const rate = Number(employeeInfo.rate) || 0;
    return Math.round(totalHours * rate * 100) / 100;
  }, [totalHours, employeeInfo.rate]);

  const downloadPDF = async () => {
    if (!pdfTemplateRef.current) return;

    setIsGeneratingPDF(true);

    const element = pdfTemplateRef.current;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
        onclone: (clonedDoc) => {
         
          clonedDoc.querySelectorAll("style").forEach((style) => {
            if (style.textContent) {
              style.textContent = style.textContent.replace(
                /oklch\([^)]*\)/g,
                "transparent",
              );
            }
          });

          const el = clonedDoc.getElementById("pdf-template-wrapper");
          if (el) {
            el.className = "";
            el.style.position = "relative";
            el.style.left = "0";
            el.style.top = "0";
            el.style.width = "auto";
            el.style.height = "auto";
            el.style.overflow = "visible";
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`timesheet_${employeeInfo.name || "document"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Hubo un error al generar el PDF. Por favor, revisa la consola para más detalles.",
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Element Safety, LLC. - Time Sheet Generator
        </h1>

        <div className="space-y-6">
          <section className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Employee Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  NAME:*
                </label>
                <input
                  type="text"
                  name="name"
                  value={employeeInfo.name}
                  onChange={handleEmployeeChange}
                  placeholder="Your Name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  OPERATOR:*
                </label>
                <input
                  type="text"
                  name="operator"
                  value={employeeInfo.operator}
                  onChange={handleEmployeeChange}
                  placeholder="e.g. Power Solutions"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  CONSULTANT ID:
                </label>
                <input
                  type="text"
                  name="consultantId"
                  value={employeeInfo.consultantId}
                  onChange={handleEmployeeChange}
                  placeholder="e.g. 11234"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  RATE ($/hr):
                </label>
                <input
                  type="number"
                  name="rate"
                  value={employeeInfo.rate}
                  onChange={handleEmployeeChange}
                  placeholder="e.g. 25"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          <section className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Project Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  INVOICE:
                </label>
                <input
                  type="text"
                  name="invoice"
                  value={projectInfo.invoice}
                  onChange={handleProjectChange}
                  placeholder="Ej: 17"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Project #:
                </label>
                <input
                  type="text"
                  name="projectNumber"
                  value={projectInfo.projectNumber}
                  onChange={handleProjectChange}
                  placeholder="Ej: IAD 45"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Location:
                </label>
                <input
                  type="text"
                  name="location"
                  value={projectInfo.location}
                  onChange={handleProjectChange}
                  placeholder="Ej: 43714 Efficiently Drive, Dulles VA 20166"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Daily Hours
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2 text-left">
                      DAY
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Date
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Start Time
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      End Time
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Hours
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Bill Hours
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Days.map((day) => (
                    <tr key={day} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2 font-medium">
                        {day}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="date"
                          value={weekData[day].date}
                          onChange={(e) =>
                            handleWeekDataChange(day, "date", e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="time"
                          value={weekData[day].startTime}
                          onChange={(e) =>
                            handleWeekDataChange(
                              day,
                              "startTime",
                              e.target.value,
                            )
                          }
                          className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="time"
                          value={weekData[day].endTime}
                          onChange={(e) =>
                            handleWeekDataChange(day, "endTime", e.target.value)
                          }
                          className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="number"
                          value={weekData[day].hours || ""}
                          readOnly
                          className="w-full p-1 border border-gray-300 rounded bg-gray-50 cursor-not-allowed"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={weekData[day].billHours}
                          readOnly
                          className="w-full p-1 border border-gray-300 rounded bg-gray-50 cursor-not-allowed"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={weekData[day].remarks}
                          onChange={(e) =>
                            handleWeekDataChange(day, "remarks", e.target.value)
                          }
                          placeholder=""
                          className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td
                      colSpan={4}
                      className="border border-gray-300 p-2 text-right"
                    >
                      TOTALS
                    </td>
                    <td className="border border-gray-300 p-2 font-bold">
                      {totalHours}
                    </td>
                    <td className="border border-gray-300 p-2 font-bold">
                      {totalBillHours}
                    </td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                  {employeeInfo.rate && (
                    <tr className="bg-blue-50 font-bold">
                      <td
                        colSpan={6}
                        className="border border-gray-300 p-2 text-right"
                      >
                        TOTAL ({totalHours} hrs × ${employeeInfo.rate}/hr)
                      </td>
                      <td className="border border-gray-300 p-2 font-bold">
                        ${totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex justify-center pt-4">
            <button
              onClick={downloadPDF}
              disabled={isGeneratingPDF}
              className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${isGeneratingPDF ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
            >
              {isGeneratingPDF ? "Generando PDF..." : "Download PDF"}
            </button>
          </div>
        </div>
      </div>

      <div
        id="pdf-template-wrapper"
        className="absolute left-[-9999px] top-[-9999px]"
      >
        <div
          ref={pdfTemplateRef}
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#9ca3af",
            color: "#000000",
          }}
          className="w-[1000px] p-8 font-sans border"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 items-center">
              {/* Logo Placeholder */}
              <div
                style={{ borderColor: "#1e3a8a" }}
                className="border-4 p-2 flex flex-col items-center"
              >
                <span
                  style={{ color: "#1e3a8a" }}
                  className="text-4xl font-bold"
                >
                  2B
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  style={{ color: "#1e3a8a" }}
                  className="text-5xl font-bold"
                >
                  Element
                </span>
                <span
                  style={{ color: "#4ade80" }}
                  className="text-4xl font-bold"
                >
                  SAFETY LLC
                </span>
              </div>
            </div>
            <div className="text-right">
              <h1
                style={{ color: "#1e3a8a" }}
                className="text-5xl font-bold mb-2"
              >
                Element Safety, LLC.
              </h1>
              <h2
                style={{ color: "#1e3a8a" }}
                className="text-4xl font-semibold "
              >
                Time Sheet
              </h2>
            </div>
          </div>

          <div
            className="grid grid-cols-2 border-2 mb-1  border-black"
          >
            <div
             
              className="grid grid-cols-[150px_1fr] border-r-2  border-black"
            >
              <div
                
                className="p-2 border-b-2 font-bold uppercase bg-blue-50 text-blue-900 border-black"
              >
                Name
              </div>
              <div
          
                className="p-2 border-b-2 font-bold flex items-center justify-center text-xl  border-black"
              >
                {employeeInfo.name}
              </div>
              <div className="p-2 border-b-2 border-black font-bold uppercase bg-blue-50 text-blue-900">
                Operator
              </div>
              <div className="p-2 border-b-2 border-black font-bold flex items-center justify-center text-xl">
                {employeeInfo.operator}
              </div>
              <div
                className="p-2 font-bold uppercase bg-blue-50 text-blue-900 border-black"
              >
                Consultant ID
              </div>
              <div className="p-2 font-bold flex items-center justify-center text-xl">
                {employeeInfo.consultantId}
              </div>
              <div
                className="p-2 border-t-2 font-bold uppercase bg-blue-50 text-blue-900 border-black"
              >
                Rate
              </div>
              <div
                style={{ borderColor: "#000000" }}
                className="p-2 border-t-2 font-bold flex items-center justify-center text-xl"
              >
                {employeeInfo.rate ? `$${employeeInfo.rate}/hr` : ""}
              </div>
            </div>
            <div className="grid grid-cols-[150px_1fr]">
              <div
                style={{
                  backgroundColor: "#eff6ff",
                  borderColor: "#000000",
                  color: "#1e3a8a",
                }}
                className="p-2 border-b-2 font-bold uppercase"
              >
                Invoice
              </div>
              <div
                style={{ borderColor: "#000000" }}
                className="p-2 border-b-2 flex items-center justify-center text-xl font-bold"
              >
                {projectInfo.invoice}
              </div>
              <div
                style={{
                  backgroundColor: "#eff6ff",
                  borderColor: "#000000",
                  color: "#1e3a8a",
                }}
                className="p-2 border-b-2 font-bold uppercase"
              >
                Project #
              </div>
              <div
                style={{ borderColor: "#000000" }}
                className="p-2 border-b-2 flex items-center justify-center text-xl font-bold"
              >
                {projectInfo.projectNumber}
              </div>
              <div
                style={{ backgroundColor: "#eff6ff", color: "#1e3a8a" }}
                className="p-2 font-bold uppercase"
              >
                Location
              </div>
              <div className="p-2 flex items-center justify-center text-xl text-center font-bold">
                {projectInfo.location}
              </div>
            </div>
          </div>

          <table
            style={{ borderColor: "#000000" }}
            className="w-full border-2 text-center border-collapse"
          >
            <thead>
              <tr
                style={{ backgroundColor: "#ffffff", borderColor: "#000000" }}
                className="border-b-2"
              >
                <th
                  style={{ borderColor: "#000000" }}
                  className="border-r-2 p-2 text-xl"
                >
                  Day
                </th>
                <th
                  style={{ borderColor: "#000000" }}
                  className="border-r-2 p-2 text-xl"
                >
                  Date
                </th>
                <th
                  style={{ borderColor: "#000000" }}
                  className="border-r-2 p-2 text-xl"
                >
                  Start Time
                </th>
                <th
                  style={{ borderColor: "#000000" }}
                  className="border-r-2 p-2 text-xl"
                >
                  End Time
                </th>
                <th
                  style={{ borderColor: "#000000" }}
                  className="border-r-2 p-2 text-xl"
                >
                  Hours
                </th>
                <th
                  style={{ borderColor: "#000000" }}
                  className="border-r-2 p-2 text-xl"
                >
                  Bill Hours
                </th>
                <th className="p-2 text-xl">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {Days.map((day) => {
                let bgColor = "#ffffff";
                let textColor = "#000000";
                if (day === "Sunday") {
                  bgColor = "#dc2626";
                  textColor = "#ffffff";
                }
                if (day === "Saturday") bgColor = "#facc15";

                return (
                  <tr
                    key={day}
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      borderColor: "#000000",
                    }}
                    className="border-b-2 h-12"
                  >
                    <td
                      style={{ borderColor: "#000000" }}
                      className="border-r-2 font-bold text-xl"
                    >
                      {day}
                    </td>
                    <td
                      style={{ borderColor: "#000000" }}
                      className="border-r-2 text-xl"
                    >
                      {weekData[day].date
                        ? dayjs(weekData[day].date).format("MM/DD/YYYY")
                        : ""}
                    </td>
                    <td
                      style={{ borderColor: "#000000" }}
                      className="border-r-2 text-xl"
                    >
                      {weekData[day].startTime
                        ? dayjs(`2000-01-01T${weekData[day].startTime}`).format(
                            "h:mm A",
                          )
                        : ""}
                    </td>
                    <td
                      style={{ borderColor: "#000000" }}
                      className="border-r-2 text-xl"
                    >
                      {weekData[day].endTime
                        ? dayjs(`2000-01-01T${weekData[day].endTime}`).format(
                            "h:mm A",
                          )
                        : ""}
                    </td>
                    <td
                      style={{ borderColor: "#000000" }}
                      className="border-r-2 text-xl"
                    >
                      {weekData[day].hours || ""}
                    </td>
                    <td
                      style={{ borderColor: "#000000" }}
                      className="border-r-2 text-xl"
                    >
                      {weekData[day].billHours}
                    </td>
                    <td className="text-xl">{weekData[day].remarks}</td>
                  </tr>
                );
              })}
              <tr
                style={{ backgroundColor: "#22c55e", borderColor: "#000000" }}
                className="border-b-2 h-12"
              >
                <td
                  colSpan={4}
                  style={{ borderColor: "#000000", color: "#000000" }}
                  className="border-r-2 text-right pr-4 font-bold text-xl uppercase"
                >
                  Totals
                </td>
                <td
                  style={{ borderColor: "#000000", color: "#000000" }}
                  className="border-r-2 font-bold text-xl"
                >
                  {totalHours}
                </td>
                <td
                  style={{ borderColor: "#000000" }}
                  className="border-r-2 font-bold text-xl"
                >
                  {totalBillHours}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 space-y-1 text-lg font-medium">
            <p>All time sheets must be signed by your supervisor.</p>
            <p>
              Time sheets must be turned in every week at the end of the last
              day worked.
            </p>
            <p>
              The work period begins Sunday morning and ends Saturday night.
            </p>
            <p>Send timesheets to: time@elementsafetyllc.com</p>
          </div>

          <div className="mt-8 flex justify-end">
            <div
              style={{ borderColor: "#000000" }}
              className="border-2 flex items-center"
            >
              <div
                style={{ borderColor: "#000000" }}
                className="p-2 border-r-2 font-bold uppercase"
              >
                Total Bill Hrs =
              </div>
              <div className="p-2 w-32 text-center font-bold text-xl">
                {totalBillHours}
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-end gap-2 text-xl font-bold">
            <span>Client Superintendent Approval:</span>
            <div
              style={{ borderColor: "#000000" }}
              className="flex-1 border-b-2 h-0 mb-1"
            ></div>
            <span className="italic font-serif">Sean Lewis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSheet;
