import { useState, type ChangeEvent, type FocusEvent } from "react";

interface LanguageEntry {
  language: string;
  proficiency: string;
}

interface Step3Props {
  formData: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (
    e:
      | ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: any } },
  ) => void;
  handleBlur: (
    e: FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  addLanguage: (language: LanguageEntry) => void;
  removeLanguage: (index: number) => void;
  handleTechnicalCompetencies: (value: string) => void;
}

const languageOptions = [
  "English",
  "Spanish",
  "Portuguese",
  "French",
  "German",
  "Italian",
  "Mandarin",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Russian",
  "Dutch",
  "Swedish",
  "Polish",
  "Turkish",
  "Vietnamese",
  "Thai",
  "Other",
];

const Step3Education = ({
  formData,
  errors: _errors,
  touched: _touched,
  handleChange,
  handleBlur,
  addLanguage,
  removeLanguage,
  handleTechnicalCompetencies,
}: Step3Props) => {
  const [newLanguage, setNewLanguage] = useState<LanguageEntry>({
    language: "",
    proficiency: "",
  });

  const handleAddLanguage = () => {
    if (newLanguage.language && newLanguage.proficiency) {
      addLanguage(newLanguage);
      setNewLanguage({ language: "", proficiency: "" });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Education</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Highest level of education achieved
          </label>
          <select
            name="highestEducation"
            value={formData.highestEducation}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M3%205l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]"
          >
            <option value=""></option>
            <option value="high-school">High School</option>
            <option value="associate">Associate Degree</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="doctorate">Doctorate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">
            Relevant certifications (e.g., OSHA, PMP, ISO, NEBOSH)
          </label>
          <input
            type="text"
            name="relevantCertifications"
            value={formData.relevantCertifications}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="List your safety certifications (CSP, CHST, PMP, ISO, NEBOSH, OSHT, OSHA 30/10, etc)"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-5">Key Skills</h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1.5">
                Technical competencies (e.g., safety programs, risk assessments,
                compliance, training)
              </label>
              <input
                type="text"
                name="technicalCompetencies"
                value={formData.keySkills.technicalCompetencies}
                onChange={(e) => handleTechnicalCompetencies(e.target.value)}
                onBlur={handleBlur}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            {formData.keySkills.languages.length > 0 && (
              <div className="space-y-2">
                {formData.keySkills.languages.map(
                  (lang: LanguageEntry, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <span className="text-sm text-gray-700">
                        {lang.language} — {lang.proficiency}
                      </span>
                      <button
                        onClick={() => removeLanguage(index)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ),
                )}
              </div>
            )}

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    Languages and proficiency levels
                  </label>
                  <select
                    value={newLanguage.language}
                    onChange={(e) =>
                      setNewLanguage({
                        ...newLanguage,
                        language: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M3%205l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]"
                  >
                    <option value=""></option>
                    {languageOptions.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    Proficiency level
                  </label>
                  <select
                    value={newLanguage.proficiency}
                    onChange={(e) =>
                      setNewLanguage({
                        ...newLanguage,
                        proficiency: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M3%205l3%203%203-3%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]"
                  >
                    <option value=""></option>
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Native">Native</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddLanguage}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add language
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Education;
