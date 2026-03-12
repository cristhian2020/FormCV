import { type ChangeEvent, type FocusEvent } from "react";

interface Step1Props {
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

const countries = [
  "United States",
  "Canada",
  "Mexico",
  "Colombia",
  "Brazil",
  "Argentina",
  "Chile",
  "Peru",
  "Ecuador",
  "Venezuela",
  "Bolivia",
  "Paraguay",
  "Uruguay",
  "Spain",
  "United Kingdom",
  "Germany",
  "France",
  "Italy",
  "Portugal",
  "Australia",
  "India",
  "China",
  "Japan",
  "South Korea",
  "Other",
];

const Step1BasicInfo = ({
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
}: Step1Props) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Basic Information
      </h2>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">
              Full name<span className="text-gray-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors
                ${
                  touched.fullName && errors.fullName
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
                }`}
            />
            {touched.fullName && errors.fullName && (
              <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">
              Email Address <span className="text-gray-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors
                ${
                  touched.email && errors.email
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
                }`}
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">
              Country of residence
            </label>
            <select
              name="countryOfResidence"
              value={formData.countryOfResidence}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M3%205l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]"
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">
              Phone Number <span className="text-gray-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors
                ${
                  touched.phoneNumber && errors.phoneNumber
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-100 focus:border-blue-400"
                }`}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
            />
          </div>
        </div>

        <div className="pt-1">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="willingnessToRelocate"
              checked={formData.willingnessToRelocate}
              onChange={handleChange}
              className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-gray-500">
              Willingness to relocate or travel?
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
