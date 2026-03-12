import type { EmployeeInfo } from "./types";

interface Props {
  employeeInfo: EmployeeInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const inputClass =
  "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";

export default function EmployeeInfoSection({ employeeInfo, onChange }: Props) {
  return (
    <section className="border-b pb-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
        Employee Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">NAME *</label>
          <input
            type="text"
            name="name"
            value={employeeInfo.name}
            onChange={onChange}
            placeholder="Your Name"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">OPERATOR *</label>
          <input
            type="text"
            name="operator"
            value={employeeInfo.operator}
            onChange={onChange}
            placeholder="e.g. Power Solutions"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">CONSULTANT ID</label>
          <input
            type="text"
            name="consultantId"
            value={employeeInfo.consultantId}
            onChange={onChange}
            placeholder="e.g. 11234"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">RATE ($/hr)</label>
          <input
            type="number"
            name="rate"
            value={employeeInfo.rate}
            onChange={onChange}
            placeholder="e.g. 25"
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
