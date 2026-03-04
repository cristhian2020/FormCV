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
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
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
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center border border-gray-200">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Application Submitted!!
          </h2>
          <p className="text-gray-500 mb-8">
            We have received your application. We will review your profile and
            contact you within two weeks if you meet the requirements.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            New application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 underline-offset-4 decoration-2">
            Apply Now
          </h1>
          <p className="text-gray-500 text-base">
            Ready to join our team? Submit your application and we'll get back
            to you soon.
          </p>
        </div>

        <div className="flex items-center justify-center mb-10">
          {[1, 2, 3, 4, 5].map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                  ${
                    step === currentStep
                      ? "bg-blue-600 text-white shadow-md"
                      : step < currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
              >
                {step < currentStep ? "✓" : step}
              </div>
              {index < 4 && (
                <div
                  className={`w-16 h-0.5 mx-1 transition-colors ${
                    step < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-300 p-10 mb-8 shadow-xl/20">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-200 rounded-md bg-blue-50">
              STEP {currentStep} OF 5
            </span>
          </div>

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

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-50 mb-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-12 py-2.5 rounded-lg font-medium transition-all text-sm
              ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              }`}
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-12 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm text-sm"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex items-center gap-2 px-12 py-2.5 rounded-lg font-medium transition-all text-sm
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
            >
              {loading ? "Enviando..." : "Submit"}
            </button>
          )}
        </div>

        <div className="text-center text-sm text-gray-700">
          <p>
            * Required fields. Applications are reviewed on a rolling basis.
          </p>
          <p>We will contact qualified candidates within 2 weeks.</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
