import { useState } from "react";
import { useApplication } from "../../hooks/useApplication";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2ProfessionalProfile from "./steps/Step2ProfesionalProfile";
import Step3Education from "./steps/Step3Education";
import Step4JobInterests from "./steps/Step4JobInterests";
import Step5Attachments from "./steps/Step5Attachments";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface KeySkills {
  technicalCompetencies: string;
  languages: { language: string; proficiency: string }[];
}

interface FormData {
  fullName: string;
  email: string;
  countryOfResidence: string;
  phoneNumber: string;
  city: string;
  state: string;
  willingnessToRelocate: boolean;
  currentJobTitle: string;
  yearsOfExperience: string;
  professionalSummary: string;
  highestEducation: string;
  relevantCertifications: string;
  mainIndustry: string;
  keySkills: KeySkills;
  desiredPosition: string;
  workArrangement: string;
  availability: string;
  salaryExpectations: string;
  linkedinProfile: string;
  coverLetterText: string;
  consentToDataProcessing: boolean;
  [key: string]: any;
}

const initialFormState: FormData = {
  fullName: "",
  email: "",
  countryOfResidence: "",
  phoneNumber: "",
  city: "",
  state: "",
  willingnessToRelocate: false,
  currentJobTitle: "",
  yearsOfExperience: "0-2 years",
  professionalSummary: "",
  highestEducation: "",
  relevantCertifications: "",
  mainIndustry: "",
  keySkills: {
    technicalCompetencies: "",
    languages: [],
  },
  desiredPosition: "",
  workArrangement: "onsite",
  availability: "",
  salaryExpectations: "",
  linkedinProfile: "",
  coverLetterText: "",
  consentToDataProcessing: false,
};

const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { loading, error, submitApplication, validateStep } = useApplication();

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | {
          target: {
            name: string;
            value: any;
            type?: string;
            checked?: boolean;
          };
        },
  ) => {
    const target = e.target;
    const name = target.name;
    const value =
      "checked" in target && target.type === "checkbox"
        ? target.checked
        : target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const validation = validateStep(formData, currentStep);
    if (validation.errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validation.errors[name] }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
      setFormData((prev) => ({ ...prev, [name]: fileList[0].name }));
    }
  };

  const addLanguage = (language: { language: string; proficiency: string }) => {
    if (language.language && language.proficiency) {
      setFormData((prev) => ({
        ...prev,
        keySkills: {
          ...prev.keySkills,
          languages: [...prev.keySkills.languages, language],
        },
      }));
    }
  };

  const handleTechnicalCompetencies = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      keySkills: {
        ...prev.keySkills,
        technicalCompetencies: value,
      },
    }));
  };

  const removeLanguage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keySkills: {
        ...prev.keySkills,
        languages: prev.keySkills.languages.filter(
          (_: { language: string; proficiency: string }, i: number) =>
            i !== index,
        ),
      },
    }));
  };

  const handleNext = () => {
    const validation = validateStep(formData, currentStep);
    setErrors(validation.errors);

    if (validation.isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    const validation = validateStep(formData, 5);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    try {
      await submitApplication(formData, files);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Error submitting application:", err);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 max-w-md w-full text-center border border-gray-200">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            ¡Application Submitted!!
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 px-2">
            We have received your application. We will review your profile and
            contact you within two weeks if you meet the requirements.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
          >
            New application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 underline-offset-4 decoration-2">
            Apply Now
          </h1>
          <p className="text-sm sm:text-base text-gray-500 px-4 sm:px-0">
            Ready to join our team? Submit your application and we'll get back
            to you soon.
          </p>
        </div>

        <div className="flex items-center justify-center mb-6 sm:mb-8 md:mb-10 overflow-x-auto py-2 px-2">
          <div className="flex items-center min-w-max">
            {[1, 2, 3, 4, 5].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all
                    ${
                      step === currentStep
                        ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-200"
                        : step < currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {step < currentStep ? "✓" : step}
                </div>
                {index < 4 && (
                  <div
                    className={`w-8 sm:w-12 md:w-16 h-0.5 mx-1 transition-colors ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-300 p-4 sm:p-6 md:p-8 lg:p-10 mb-6 sm:mb-8 shadow-lg">
          <div className="mb-4 sm:mb-6">
            <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-200 rounded-md bg-blue-50">
              STEP {currentStep} OF 5
            </span>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {currentStep === 1 && (
              <Step1BasicInfo
                formData={formData}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            )}

            {currentStep === 2 && (
              <Step2ProfessionalProfile
                formData={formData}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            )}

            {currentStep === 3 && (
              <Step3Education
                formData={formData}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                addLanguage={addLanguage}
                removeLanguage={removeLanguage}
                handleTechnicalCompetencies={handleTechnicalCompetencies}
              />
            )}

            {currentStep === 4 && (
              <Step4JobInterests
                formData={formData}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            )}

            {currentStep === 5 && (
              <Step5Attachments
                formData={formData}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleFileChange={handleFileChange}
                files={files}
              />
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-row justify-center items-center gap-4 sm:gap-50 mb-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-8 md:px-10 lg:px-12 py-2.5 sm:py-2.5 rounded-lg font-medium transition-all text-sm
              ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:transform active:scale-95"
              }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> 
            <span>Back</span>
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-8 md:px-10 lg:px-12 py-2.5 sm:py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm text-sm active:transform active:scale-95
                ${currentStep === 1 ? "sm:flex-1" : ""}`}
            >
              <span>Next</span> 
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-8 md:px-10 lg:px-12 py-2.5 sm:py-2.5 rounded-lg font-medium transition-all text-sm
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:transform active:scale-95"
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>

        <div className="text-center text-xs sm:text-sm text-gray-700 space-y-1 px-2 max-w-2xl mx-auto">
          <p className="leading-relaxed">
            <span className="font-medium text-gray-900">*</span> Required fields. Applications are reviewed on a rolling basis.
          </p>
          <p className="leading-relaxed font-medium text-gray-800">
            We will contact qualified candidates within 2 weeks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;