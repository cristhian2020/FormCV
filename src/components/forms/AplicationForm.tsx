import { useApplicationForm } from "../../hooks/useApplicationForm";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2ProfessionalProfile from "./steps/Step2ProfesionalProfile";
import Step3Education from "./steps/Step3Education";
import Step4JobInterests from "./steps/Step4JobInterests";
import Step5Attachments from "./steps/Step5Attachments";
import SuccessScreen from "./SuccessScreen";
import StepProgressBar from "./StepProgressBar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ApplicationForm = () => {
  const {
    currentStep,
    formData,
    errors,
    touched,
    files,
    submitSuccess,
    loading,
    error,
    handleChange,
    handleBlur,
    handleFileChange,
    addLanguage,
    handleTechnicalCompetencies,
    removeLanguage,
    handleNext,
    handleBack,
    handleSubmit,
  } = useApplicationForm();

  if (submitSuccess) {
    return <SuccessScreen onReset={() => window.location.reload()} />;
  }

  const stepsMap: Record<number, React.ReactNode> = {
    1: (
      <Step1BasicInfo
        formData={formData}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
    ),
    2: (
      <Step2ProfessionalProfile
        formData={formData}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
    ),
    3: (
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
    ),
    4: (
      <Step4JobInterests
        formData={formData}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
    ),
    5: (
      <Step5Attachments
        formData={formData}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleFileChange={handleFileChange}
        files={files}
      />
    ),
  };

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

        <StepProgressBar currentStep={currentStep} />

        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-300 p-4 sm:p-6 md:p-8 lg:p-10 mb-6 sm:mb-8 shadow-lg">
          <div className="mb-4 sm:mb-6">
            <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-200 rounded-md bg-blue-50">
              STEP {currentStep} OF 5
            </span>
          </div>

          <div className="space-y-4 sm:space-y-6">{stepsMap[currentStep]}</div>

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
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
            <span className="font-medium text-gray-900">*</span> Required
            fields. Applications are reviewed on a rolling basis.
            <br />
            We will contact qualified candidates within 2 weeks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
