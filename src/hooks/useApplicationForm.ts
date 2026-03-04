import { useState } from "react";
import { useApplication } from "./useApplication";

export interface KeySkills {
  technicalCompetencies: string;
  languages: { language: string; proficiency: string }[];
}

export interface FormData {
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

export const useApplicationForm = () => {
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return {
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
  };
};
