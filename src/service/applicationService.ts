import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface UploadResult {
  url: string;
  path: string;
  fileName: string;
}

class ApplicationService {
  private collectionName: string;

  constructor() {
    this.collectionName = "applications";
  }

  validateStep(data: Record<string, any>, step: number): ValidationResult {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!data.fullName?.trim()) errors.fullName = "Full name is required";
        if (!data.email?.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          errors.email = "Invalid email format";
        }
        if (!data.phoneNumber?.trim())
          errors.phoneNumber = "Phone number is required";
        break;

      case 2:
        if (!data.yearsOfExperience)
          errors.yearsOfExperience = "Years of experience is required";
        break;

      case 4:
        if (!data.desiredPosition?.trim())
          errors.desiredPosition = "Desired position is required";
        if (!data.workArrangement)
          errors.workArrangement = "Work arrangement is required";
        if (!data.availability)
          errors.availability = "Availability is required";
        break;

      case 5:
        if (!data.consentToDataProcessing) {
          errors.consentToDataProcessing = "You must agree to data processing";
        }
        break;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async uploadFile(file: File, folder: string): Promise<UploadResult> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const fullPath = `applications/${folder}/${fileName}`;
      const storageRef = ref(storage, fullPath);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return {
        url: downloadURL,
        path: fullPath,
        fileName: file.name,
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file");
    }
  }

  async saveApplication(
    formData: Record<string, any>,
    files: Record<string, File> = {},
  ) {
    try {
      let resumeData: UploadResult | null = null;

      if (files.resume) {
        resumeData = await this.uploadFile(files.resume, "resumes");
      }

      const applicationData: Record<string, any> = {
        ...formData,
        resume: resumeData?.url || null,
        resumeFileName: resumeData?.fileName || null,
        submittedAt: serverTimestamp(),
        status: "pending",
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      const docRef = await addDoc(
        collection(db, this.collectionName),
        applicationData,
      );

      return {
        id: docRef.id,
        ...applicationData,
      };
    } catch (error) {
      console.error("Error saving application:", error);
      throw new Error("Failed to submit application");
    }
  }

  private mapFirebaseDataToComponent(data: any): any {
    return {
      id: data.id,
      // Personal Information
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phone || data.phoneNumber,
      
      // Professional Information
      currentJobTitle: data.jobTitle || data.currentJobTitle,
      yearsOfExperience: data.yearsExperience || data.yearsOfExperience,
      mainIndustry: data.industries || data.mainIndustry,
      professionalSummary: data.summary || data.professionalSummary,
      desiredPosition: data.desiredPosition,
      
      // Education
      highestEducation: data.educationLevel || data.highestEducation,
      relevantCertifications: data.certifications || data.relevantCertifications,
      
      // Skills
      keySkills: {
        technicalCompetencies: data.technicalCompetencies || data.keySkills?.technicalCompetencies,
        languages: data.languages || data.keySkills?.languages || [],
      },
      
      // Work Preferences
      workArrangement: data.workArrangement,
      availability: data.availability,
      salaryExpectations: data.salary || data.salaryExpectations,
      willingnessToRelocate: data.relocate !== undefined ? data.relocate : data.willingnessToRelocate,
      consentToDataProcessing: data.agreement !== undefined ? data.agreement : data.consentToDataProcessing,
      
      // Location
      city: data.city,
      state: data.state,
      countryOfResidence: data.country || data.countryOfResidence,
      
      // Resume and Links
      resume: data.resumeURL || data.resume,
      resumeFileName: data.resume || data.resumeFileName,
      linkedinProfile: data.linkedin || data.linkedinProfile,
      coverLetterText: data.coverLetter || data.coverLetterText,
      
      // Timestamps and Status
      submittedAt: data.createdAt || data.submittedAt,
      status: data.status || "pending",
    };
  }

  async getApplications() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const applications: Record<string, any>[] = [];

      querySnapshot.forEach((doc) => {
        const mappedData = this.mapFirebaseDataToComponent({
          id: doc.id,
          ...doc.data(),
        });
        applications.push(mappedData);
      });

      return applications;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw new Error("Failed to fetch applications");
    }
  }

  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }
  validateFileSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
}

export default new ApplicationService();
