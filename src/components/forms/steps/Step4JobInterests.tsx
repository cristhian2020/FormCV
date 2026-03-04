import { type ChangeEvent, type FocusEvent } from "react";

interface Step4Props {
  formData: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  handleBlur: (
    e: FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
}

const desiredPositions = [
  "HSE Manager",
  "HSE Coordinator",
  "HSE Supervisor",
  "Safety Officer",
  "Safety Engineer",
  "Environmental Specialist",
  "Risk Manager",
  "Compliance Officer",
  "Other",
];

const Step4JobInterests = ({
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
}: Step4Props) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Job Interests</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Desired position (e.g., HSE Manager, Coordinator, Supervisor)
          </label>
          <select
            name="desiredPosition"
            value={formData.desiredPosition}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M3%205l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]
              ${
                touched.desiredPosition && errors.desiredPosition
                  ? "border-red-400 focus:ring-red-100"
                  : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
              }`}
          >
            <option value=""></option>
            {desiredPositions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
          {touched.desiredPosition && errors.desiredPosition && (
            <p className="mt-1 text-xs text-red-500">
              {errors.desiredPosition}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Preferred work arrangement (onsite, hybrid, remote)
          </label>
          <select
            name="workArrangement"
            value={formData.workArrangement}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M3%205l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]
              ${
                touched.workArrangement && errors.workArrangement
                  ? "border-red-400 focus:ring-red-100"
                  : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
              }`}
          >
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>
          {touched.workArrangement && errors.workArrangement && (
            <p className="mt-1 text-xs text-red-500">
              {errors.workArrangement}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Availability to start
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M3%205l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]
              ${
                touched.availability && errors.availability
                  ? "border-red-400 focus:ring-red-100"
                  : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
              }`}
          >
            <option value="">Select option</option>
            <option value="immediate">Immediate</option>
            <option value="2-weeks">2 weeks</option>
            <option value="1-month">1 month</option>
            <option value="negotiable">Negotiable</option>
          </select>
          {touched.availability && errors.availability && (
            <p className="mt-1 text-xs text-red-500">{errors.availability}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Salary expectations (optional)
          </label>
          <input
            type="number"
            name="salaryExpectations"
            value={formData.salaryExpectations}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            step="1000"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};

export default Step4JobInterests;
