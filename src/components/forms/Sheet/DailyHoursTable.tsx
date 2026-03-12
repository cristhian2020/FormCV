import type { DayData } from "./types";
import { DAYS } from "./types";

interface Props {
  weekData: Record<string, DayData>;
  totalHours: number;
  totalBillHours: number;
  totalAmount: number;
  rate: string;
  onDayChange: (day: string, field: keyof DayData, value: string | number) => void;
}

const inputBase =
  "w-full p-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const readonlyClass =
  "w-full p-1 border border-gray-300 rounded text-sm bg-gray-50 cursor-not-allowed";

/** Card layout for mobile, table for desktop */
export default function DailyHoursTable({
  weekData,
  totalHours,
  totalBillHours,
  totalAmount,
  rate,
  onDayChange,
}: Props) {
  return (
    <section>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
        Daily Hours
      </h2>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200">
              {["DAY", "Date", "Start", "End", "Hours", "Bill Hrs", "Remarks"].map((h) => (
                <th key={h} className="border border-gray-300 p-2 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 font-medium whitespace-nowrap">
                  {day}
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="date"
                    value={weekData[day].date}
                    onChange={(e) => onDayChange(day, "date", e.target.value)}
                    className={inputBase}
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="time"
                    value={weekData[day].startTime}
                    onChange={(e) => onDayChange(day, "startTime", e.target.value)}
                    className={inputBase}
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="time"
                    value={weekData[day].endTime}
                    onChange={(e) => onDayChange(day, "endTime", e.target.value)}
                    className={inputBase}
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input type="number" value={weekData[day].hours || ""} readOnly className={readonlyClass} />
                </td>
                <td className="border border-gray-300 p-1">
                  <input type="text" value={weekData[day].billHours} readOnly className={readonlyClass} />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="text"
                    value={weekData[day].remarks}
                    onChange={(e) => onDayChange(day, "remarks", e.target.value)}
                    className={inputBase}
                  />
                </td>
              </tr>
            ))}
            <TotalsRow
              totalHours={totalHours}
              totalBillHours={totalBillHours}
              totalAmount={totalAmount}
              rate={rate}
              colSpan={4}
            />
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards (hidden on desktop) ── */}
      <div className="md:hidden space-y-3">
        {DAYS.map((day) => (
          <div key={day} className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">{day}</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500">Date</label>
                <input
                  type="date"
                  value={weekData[day].date}
                  onChange={(e) => onDayChange(day, "date", e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Hours</label>
                <input type="number" value={weekData[day].hours || ""} readOnly className={readonlyClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Start</label>
                <input
                  type="time"
                  value={weekData[day].startTime}
                  onChange={(e) => onDayChange(day, "startTime", e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">End</label>
                <input
                  type="time"
                  value={weekData[day].endTime}
                  onChange={(e) => onDayChange(day, "endTime", e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Bill Hrs</label>
                <input type="text" value={weekData[day].billHours} readOnly className={readonlyClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Remarks</label>
                <input
                  type="text"
                  value={weekData[day].remarks}
                  onChange={(e) => onDayChange(day, "remarks", e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Mobile totals */}
        <div className="border border-gray-300 rounded-lg p-3 bg-gray-100 font-bold text-sm">
          <div className="flex justify-between">
            <span>Total Hours</span>
            <span>{totalHours}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Bill Hours</span>
            <span>{totalBillHours}</span>
          </div>
          {rate && (
            <div className="flex justify-between mt-1 pt-1 border-t border-gray-300">
              <span>
                Total ({totalHours} hrs × ${rate}/hr)
              </span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Shared totals row for the desktop table */
function TotalsRow({
  totalHours,
  totalBillHours,
  totalAmount,
  rate,
  colSpan,
}: {
  totalHours: number;
  totalBillHours: number;
  totalAmount: number;
  rate: string;
  colSpan: number;
}) {
  return (
    <>
      <tr className="bg-gray-100 font-bold text-sm">
        <td colSpan={colSpan} className="border border-gray-300 p-2 text-right">
          TOTALS
        </td>
        <td className="border border-gray-300 p-2">{totalHours}</td>
        <td className="border border-gray-300 p-2">{totalBillHours}</td>
        <td className="border border-gray-300 p-2" />
      </tr>
      {rate && (
        <tr className="bg-blue-50 font-bold text-sm">
          <td colSpan={6} className="border border-gray-300 p-2 text-right">
            TOTAL ({totalHours} hrs × ${rate}/hr)
          </td>
          <td className="border border-gray-300 p-2">${totalAmount.toFixed(2)}</td>
        </tr>
      )}
    </>
  );
}
