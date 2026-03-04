import { useState, useCallback } from "react";
import applicationService from "../service/applicationService";

export const useApplication = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<Record<string, any> | null>(
    null,
  );

  const submitApplication = useCallback(
    async (formData: Record<string, any>, files: Record<string, File> = {}) => {
      setLoading(true);
      setError(null);

      try {
        const validation = applicationService.validateStep(formData, 5);
        if (!validation.isValid) {
          throw new Error(Object.values(validation.errors)[0] as string);
        }

        if (files.resume) {
          const validTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ];

          if (!applicationService.validateFileType(files.resume, validTypes)) {
            throw new Error(
              "Invalid file type for resume. Please upload PDF or Word document",
            );
          }

          if (!applicationService.validateFileSize(files.resume, 5)) {
            throw new Error("Resume file size exceeds 5MB limit");
          }
        }

        if (files.coverLetter) {
          const validTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
          ];

          if (
            !applicationService.validateFileType(files.coverLetter, validTypes)
          ) {
            throw new Error("Invalid file type for cover letter");
          }

          if (!applicationService.validateFileSize(files.coverLetter, 5)) {
            throw new Error("Cover letter file size exceeds 5MB limit");
          }
        }

        const result = await applicationService.saveApplication(
          formData,
          files,
        );
        setApplication(result);
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const validateStep = useCallback(
    (data: Record<string, any>, step: number) => {
      return applicationService.validateStep(data, step);
    },
    [],
  );

  return {
    loading,
    error,
    application,
    submitApplication,
    validateStep,
  };
};
