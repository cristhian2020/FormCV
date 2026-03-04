import React from "react";

interface Step2Props {
  formData: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
}

const Step2ProfessionalProfile = ({
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
}: Step2Props) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Professional Profile
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Current or most recent job title
          </label>
          <input
            type="text"
            name="currentJobTitle"
            value={formData.currentJobTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Total years of experience <span className="text-gray-500">*</span>
          </label>
          <select
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M3%205l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]
              ${
                touched.yearsOfExperience && errors.yearsOfExperience
                  ? "border-red-400 focus:ring-red-100"
                  : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
              }`}
          >
            <option value="0-2 years">0-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="6-10 years">6-10 years</option>
            <option value="10+ years">10+ years</option>
          </select>
          {touched.yearsOfExperience && errors.yearsOfExperience && (
            <p className="mt-1 text-xs text-red-500">
              {errors.yearsOfExperience}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Main industries worked in (e.g., healthcare, data centers, etc.)
          </label>
          <input
            type="text"
            name="mainIndustry"
            value={formData.mainIndustry}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Short professional summary (2–3 lines)
          </label>
          <textarea
            name="professionalSummary"
            value={formData.professionalSummary}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Step2ProfessionalProfile;
