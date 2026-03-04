import { type ChangeEvent, type FocusEvent } from "react";

interface Step5Props {
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
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  files: Record<string, File>;
}

const Step5Attachments = ({
  formData,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleFileChange,
  files,
}: Step5Props) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Attachments / Supporting Documents
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Updated resume (PDF or Word)
          </label>
          <div className="relative">
            <input
              type="file"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 file:hidden cursor-pointer"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
          </div>
          {files.resume && (
            <p className="mt-1 text-xs text-green-600">✓ {files.resume.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Cover letter (optional)
          </label>
          <textarea
            name="coverLetterText"
            value={formData.coverLetterText || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            LinkedIn profile link
          </label>
          <input
            type="url"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consentToDataProcessing"
              checked={formData.consentToDataProcessing}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer ${
                touched.consentToDataProcessing &&
                errors.consentToDataProcessing
                  ? "border-red-500"
                  : ""
              }`}
            />
            <span className="text-sm text-gray-700">
              I agree to the collection and processing of my personal data for
              employment purposes. <span className="text-gray-500">*</span>
            </span>
          </label>
          {touched.consentToDataProcessing &&
            errors.consentToDataProcessing && (
              <p className="mt-1 text-xs text-red-500 ml-8">
                {errors.consentToDataProcessing}
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Step5Attachments;
